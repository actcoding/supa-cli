import { configFile } from '@/config'
import type { GlobalOptions, Installer } from '@/types'
import { action } from '@/utils'
import confirm from '@inquirer/confirm'
import { log } from 'console'
import { mkdir, stat, writeFile } from 'fs/promises'
import { dirname } from 'path'

type Options = GlobalOptions & {
}

const installer: Installer = program => {
    program.command('config:generate')
        .description('Generates a configuration file.')
        .action(action<Options>(async ({ opts }) => {
            try {
                await stat(configFile)
                if (!opts.force) {
                    const answer = await confirm({
                        message: 'A config file already exists. Overwrite?'
                    })
                    if (!answer) {
                        console.error('Action canceled by user.')
                        return
                    }
                }
            } catch (error) {
                // ignore
            }

            await mkdir(dirname(configFile), { recursive: true })
            await writeFile(configFile, JSON.stringify({
                '$schema': '../node_modules/@actcoding/supa-cli/config.schema.json'
            }, null, 4))

            log(`Config file created at ${configFile}`)
        }))
}

export default installer
