import type { GlobalOptions, Installer } from '@/types.js'
import { action } from '@/utils.js'
import { seed } from '../migrate/index.js'

type Options = GlobalOptions & {
    seeder?: string
}

const installer: Installer = program => {
    program.command('db:seed')
        .description('Seed the database')
        .option('-s, --seeder <name>', 'A custom seeder to use')
        .action(action<Options>(async ({ opts }) => {
            await seed(opts.seeder, opts.linked)
        }))
}

export default installer
