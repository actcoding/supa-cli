import confirm from '@inquirer/confirm'
import { createCommand } from 'commander'
import { log } from 'console'
import { compile } from 'ejs'
import { mkdir, stat, writeFile } from 'fs/promises'
import { basename, join } from 'path'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import slug from 'slug'
import { unified } from 'unified'

type Options = {
    force: boolean
}

const directory = join('docs', 'command-reference')

const program = createCommand(basename(import.meta.file, '.ts'))

const template = compile(`
# <%= name %>

<% if (description) { %>
> <%= description %>
<% } %>

## Usage

\`\`\`shell
<%- usage %>
\`\`\`

<% if (args.length > 0) { %>

## Arguments

<small>Required arguments are marked with an asterik (*)</small>

<% args.forEach(function (arg) { %>
- \`<%= arg.name() %><%= arg.variadic ? '…' : '' %>\`<%= arg.required ? '*' : '' %> - <%= arg.description %>
<% }); %>

<% } %>

## Options

<% if (options.local.length > 0) { %>

### Local

<% options.local.forEach(function (option) { %>
- \`<%- option.flags %>\` - <%= option.description %>
<% }); %>

<% } %>

### Global

<% options.global.forEach(function (option) { %>
- \`<%- option.flags %>\` - <%= option.description %>
<% }); %>

`, {
    async: true,
    beautify: false,
})

program.description('Generate documentation files for all CLI commands')
    .option('--force', 'Force the operation to run without asking for confirmation.', false)
    .action(async (opts: Options) => {
        await mkdir(directory, { recursive: true })

        let counter = 0

        process.env.__SCRIPT = '1'
        const { program } = await import('../cli/index')

        for await (const command of program.commands) {
            counter++

            const file = `${counter.toString().padStart(2, '0')}-${slug(command.name().replaceAll(':', '-'))}.md`
            const absolute = join(directory, file)

            const markdown = await unified()
                .use(remarkParse)
                .use(remarkStringify)
                .process(await template({
                    name: command.name(),
                    description: command.description(),
                    options: {
                        local: command.options,
                        global: program.options,
                    },
                    args: command.registeredArguments,
                    usage: `${command.name()} ${command.usage()}`,
                }))

            if (!opts.force) {
                try {
                    await stat(absolute)
                    const answer = await confirm({
                        message: `A documentation file for the command '${command.name()}' does already exist. Overwrite?`,
                    })
                    if (!answer) {
                        continue
                    }
                } catch (error) {
                    // ignore
                }
            }

            await writeFile(absolute, String(markdown))
        }

        log(`Created ${counter} documentation files.`)
    })

await program.parseAsync(process.argv)
