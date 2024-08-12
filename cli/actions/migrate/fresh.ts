import type { GlobalOptions, Installer } from '@/types.js'
import { action } from '@/utils.js'
import { countMigrations, migrate } from './index.js'

type Options = GlobalOptions & {}

const installer: Installer = program => {
    program.command('migrate:fresh')
        .description('Drop all tables and re-run all migrations')
        .action(action<Options>(async ({ opts }) => {
            const count = await countMigrations()
            await migrate('down', opts.linked, { count })
            await migrate('up', opts.linked)
        }))
}

export default installer
