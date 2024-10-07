import { configFile, locations } from '@/config.js'
import type { GlobalOptions, Installer } from '@/types.js'
import { action } from '@/utils.js'
import confirm from '@inquirer/confirm'
import select from '@inquirer/select'
import { log } from 'console'
import { mkdir, stat, writeFile } from 'fs/promises'
import { dirname } from 'path'

type Options = GlobalOptions & {
}

async function handleExisting(path: string): Promise<boolean> {
    try {
        await stat(path)
        const answer = await confirm({
            message: 'A config file already exists. Overwrite?',
        })
        if (!answer) {
            console.error('Action canceled by user.')
            return false
        }
    } catch (error) {
        // ignore
    }

    return true
}

const installer: Installer = program => {
    program.command('config:generate')
        .description('Generates a configuration file')
        .action(action<Options>(async ({ opts }) => {
            if (configFile !== undefined && !opts.force) {
                await handleExisting(configFile)
            }

            const location = await select({
                message: 'Choose a location for the config file',
                choices: locations
                    .map(location => location.join('/'))
                    .map(location => ({
                        name: location,
                        value: location,
                    })),
            })

            if (!opts.force) {
                await handleExisting(location)
            }

            await mkdir(dirname(location), { recursive: true })
            await writeFile(location, JSON.stringify({
                '$schema': '../node_modules/@actcoding/supa-cli/config.schema.json',
            }, null, 4))

            log(`Config file created at ${configFile}`)
        }))
}

export default installer
