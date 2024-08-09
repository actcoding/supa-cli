import config from '@/config'
import type { GlobalOptions, Installer } from '@/types'
import { action } from '@/utils'
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
