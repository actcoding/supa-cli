import confirm from '@inquirer/confirm'
import { program } from 'commander'
import { error, log } from 'console'
import { mkdir, stat, writeFile } from 'fs/promises'
import { dirname, join, resolve } from 'path'

const template = `
import type { GlobalOptions, Installer } from '@/types'
import { action } from '@/utils'

type Options = GlobalOptions & {
}

const installer: Installer = program => {
    program.command('namespace:command')
        .description('description')
        .action(action<Options>(async ({ opts, args, cmd }) => {
            // TODO: Implement
        }))
}

export default installer
`

const directory = resolve('cli/actions')

type Options = {
    force: boolean
}

program.name('gen-command')
    .description('Generate a new command')
    .argument('<name>', 'The command name. Use dots (.) to denote a nested command or a namespace.')
    .option('--force', 'Force the operation to run without asking for confirmation.', false)
    .action(async (name: string, opts: Options) => {
        if (! /^[a-zA-Z0-9-_]+\.?[a-zA-Z0-9-_]+$/g.test(name)) {
            error('You may only use alpha-numeric characters, hyphens, underscores and optionally one dot in the name!')
            process.exit(1)
        }


        const absolute = join(directory, name.replaceAll('.', '/')) + '.ts'
        const baseDirectory = dirname(absolute)

        await mkdir(baseDirectory, { recursive: true })

        if (!opts.force) {
            try {
                await stat(absolute)
                const answer = await confirm({
                    message: `The command ${name} does already exist. Overwrite?`,
                })
                if (!answer) {
                    error('Action canceled by user.')
                    return
                }
            } catch (error) {
                // ignore
            }
        }

        await writeFile(absolute, template.trimStart())
        log(`Created new command at ${absolute}`)

        await import('./gen-actions')
    })

await program.parseAsync(process.argv)
