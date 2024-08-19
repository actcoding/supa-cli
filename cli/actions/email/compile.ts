import type { GlobalOptions, Installer } from '@/types.js'
import { action, supabaseProjectRef } from '@/utils.js'
import { Option } from 'commander'
import { log } from 'console'
import { readFile, writeFile } from 'fs/promises'
import { glob } from 'glob'
import type { Root } from 'hast'
import { selectAll } from 'hast-util-select'
import mjml2html from 'mjml'
import type { MJMLParseResults, MJMLParsingOptions } from 'mjml-core'
import { basename, join, resolve } from 'path'
import { rehype } from 'rehype'
import rehypeMinify from 'rehype-preset-minify'
import rehypeStringify from 'rehype-stringify'

const directory = resolve('supabase/emails')

const supabaseConfigMap: Record<string, string> = {
    'confirmation': 'mailer_templates_confirmation_content',
    'email_change': 'mailer_templates_email_change_content',
    'invite': 'mailer_templates_invite_content',
    'magic_link': 'mailer_templates_magic_link_content',
    'reauthentication': 'mailer_templates_reauthentication_content',
    'recovery': 'mailer_templates_recovery_content',
}

type Options = GlobalOptions & {
    deploy: boolean
}

const installer: Installer = program => {
    program.command('email:compile')
        .description('Compile and optionally deploy email templates')
        .addOption(
            new Option('--deploy', 'Enable deployment to linked Supabase project. (Implies --linked)')
                .implies({ linked: true }),
        )
        .action(action<Options>(async ({ opts }) => {
            const projectRef = opts.deploy ? await supabaseProjectRef() : null

            const files = await glob('*.mjml', { cwd: directory })
            files.sort()

            log(`Will compile ${files.length} files …`)

            let i = 0
            for await (const file of files) {
                try {
                    log()
                    log(`Processing file ${file} (${++i}/${files.length}) …`)

                    const abs = join(directory, file)
                    const template = await readFile(abs)
                    const converted = convert(template.toString('utf8'), {
                        filePath: abs,
                    })

                    if (converted.error) {
                        console.error(converted.error.message)
                        continue
                    }

                    const { errors, html } = converted

                    if (errors.length > 0) {
                        console.error(errors)
                        continue
                    }

                    const result = await rehype()
                        .use(inlineImages)
                        .use(rehypeMinify)
                        .use(rehypeStringify)
                        .process(html)

                    await writeFile(`${directory}/${file}.html`, String(result))

                    if (!opts.deploy) {
                        continue
                    }

                    const response = await fetch(
                        `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                [supabaseConfigMap[basename(file, '.mjml')]]: String(result),
                            }),
                        },
                    )

                    if (!response.ok) {
                        console.error(await response.json())
                        continue
                    }
                } catch (error) {
                    console.error(error)
                    continue
                }
            }
        }))
}

export default installer

type ConvertResults = {
    error: Error
} | {
    error: null
} & MJMLParseResults

function convert(input: string, options?: MJMLParsingOptions): ConvertResults {
    try {
        const results = mjml2html(input, options)
        return {
            error: null,
            ...results,
        }
    } catch (error) {
        return {
            error: error as Error,
        }
    }
}

type InlineOptions = {
    cwd?: string
}

const inlineImages = ({
    cwd = process.cwd(),
}: InlineOptions = {}) => {
    return async (rootNode: Root) => {
        const imgElements = selectAll('img', rootNode)
        for await (const image of imgElements) {
            const imgPath = image.properties.src as string
            if (imgPath?.startsWith('data:')) {
                // ignore image that's already inlined
                return
            }

            const isRemote = imgPath.startsWith('https://')
            const fileExt = imgPath?.match('\\.([a-zA-Z]+)$')?.[1]
            if (fileExt === undefined || fileExt === null) {
                throw new Error('image path without file extension')
            }

            const imgPathAbsolute = join(cwd, imgPath)

            if (fileExt === 'svg') {
                const imgContent = await doReadFile(isRemote ? imgPath : imgPathAbsolute, isRemote)
                image.properties.src = `data:image/svg+xml;base64,${imgContent}`
            } else {
                const imgContent = await doReadFile(isRemote ? imgPath : imgPathAbsolute, isRemote)
                image.properties.src = `data:image/${fileExt};base64,${imgContent}`
            }
        }
    }
}

async function doReadFile(path: string, isRemote: boolean) {
    if (isRemote) {
        const response = await fetch(path, {
            method: 'GET',
            cache: 'no-store',
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.arrayBuffer()
        return Buffer.from(data).toString('base64')
    }

    return await readFile(path, 'base64')
}
