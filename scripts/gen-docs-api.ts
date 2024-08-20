import confirm from '@inquirer/confirm'
import type { Comment, Identifier, Program } from 'acorn'
import { createCommand } from 'commander'
import { parse as parseComment } from 'comment-parser'
import { log } from 'console'
import { compile } from 'ejs'
import { parse } from 'espree'
import { mkdir, readFile, stat, writeFile } from 'fs/promises'
import { basename, join } from 'path'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'

const pkg = JSON.parse((await readFile('package.json')).toString('utf8'))

type Options = {
    force: boolean
}

const template = compile(`
Title:   <%= name %>
Summary: <%= description %>

# \`<%= name %>(): <%= returns.type %>\`

> <%= description %>

## Return value

\`<%= returns.type %>\`

<%= returns.description %>

<% if (examples.length > 0) { %>
### Examples

<% examples.forEach(function(example){ %>
<%- example.description %>
<% }); %>

<% } %>

## Usage

\`\`\`js
import { <%= name %> } from '${pkg.name}'
\`\`\`
`, {
    async: true,
    beautify: false,
})

const inputDirectory = 'dist'
const inputFile = `${inputDirectory}/public.js`
const outputDirectory = join('docs', 'api-reference')

const program = createCommand(basename(import.meta.file, '.ts'))

program.description('Generate documentation files for all exported API symbols.')
    .option('--force', 'Force the operation to run without asking for confirmation.', true)
    .action(async (opts: Options) => {
        await mkdir(outputDirectory, { recursive: true })

        const contents = await readFile(inputFile)
        const ast = parse(contents.toString('utf8'), {
            ecmaVersion: 'latest',
            sourceType: 'module',
        })

        let counter = 0

        for await (const element of ast.body) {
            if (element.type !== 'ExportNamedDeclaration') {
                continue
            }

            const sourceFile = join(inputDirectory, element.source!.value as string)
            const names = element.specifiers.map(spec => {
                const id = spec.exported as Identifier
                return id.name
            })

            const contentsSource = await readFile(sourceFile)
            const astSource = await parse(contentsSource.toString('utf8'), {
                ecmaVersion: 'latest',
                sourceType: 'module',
                comment: true,
            }) as Program & { comments: Comment[] }

            inner: for await (const node of astSource.body) {
                if (node.type !== 'ExportNamedDeclaration') {
                    continue inner
                }

                if (node.declaration?.type !== 'FunctionDeclaration') {
                    continue inner
                }

                if (!names.includes(node.declaration.id.name)) {
                    continue inner
                }

                const comment = astSource.comments.find(comment => {
                    return comment.type === 'Block' && comment.end === node.start - 1
                })
                if (comment === undefined) {
                    throw new Error(`Public exported member ${node.declaration.id.name} does not have a documentation block!`)
                }

                const parsedCommentBlocks = parseComment(`/**\n${comment.value}\n*/`, {
                    spacing: 'preserve',
                })
                if (parsedCommentBlocks.length > 1) {
                    throw new Error(`Public exported member ${node.declaration.id.name} must not have multiple documentation blocks!`)
                }

                const parsedComment = parsedCommentBlocks[0]

                const params = parsedComment.tags.filter(tag => tag.tag === 'param')
                const examples = parsedComment.tags.filter(tag => tag.tag === 'example')
                const returns = parsedComment.tags.find(tag => tag.tag === 'returns')

                const markdown = await unified()
                    .use(remarkParse)
                    .use(remarkStringify)
                    .process(await template({
                        name: node.declaration.id.name,
                        description: parsedComment.description,
                        params, returns, examples,
                    }))

                counter++
                const file = `${counter.toString().padStart(2, '0')}-${node.declaration.id.name}.md`
                const absolute = join(outputDirectory, file)

                if (!opts.force) {
                    try {
                        await stat(absolute)
                        const answer = await confirm({
                            message: `A documentation file for the member '${node.declaration.id.name}' does already exist. Overwrite?`,
                        })
                        if (!answer) {
                            continue inner
                        }
                    } catch (error) {
                        // ignore
                    }
                }

                await writeFile(absolute, String(markdown))
            }
        }

        log(`Created ${counter} documentation files.`)
    })

await program.parseAsync(process.argv)
