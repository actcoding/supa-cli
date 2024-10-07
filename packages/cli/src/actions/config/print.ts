import config from '@/config.js'
import type { GlobalOptions, Installer } from '@/types.js'
import { action } from '@/utils.js'
import { log } from 'console'

type Options = GlobalOptions & {
}

const installer: Installer = program => {
    program.command('config:print')
        .description('Prints the effective config object')
        .action(action<Options>(async () => {
            //@ts-ignore
            delete config['$schema']
            log(config)
        }))
}

export default installer
