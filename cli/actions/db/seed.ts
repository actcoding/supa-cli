import type { GlobalOptions, Installer } from '../../types'
import { action } from '../../utils'
import { seed } from '../migrate'

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
