import type { GlobalOptions, Installer } from '@/types.js'
import { action } from '@/utils.js'
import { migrate } from './index.js'

type Options = GlobalOptions & {}

const installer: Installer = program => {
    program.command('migrate:redo')
        .description('Rollback and re-run the last database migration')
        .action(action<Options>(async ({ opts }) => {
            await migrate('down', opts.linked, { count: 1 })
            await migrate('up')
        }))
}

export default installer
