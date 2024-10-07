import type { GlobalOptions, Installer } from '@/types.js'
import { action, bunx } from '@/utils.js'
import { migrate, seed } from '../migrate/index.js'
import { generateTypes } from './typegen.js'

type Options = GlobalOptions & {
    migrate: boolean
    seed: boolean
    typegen: boolean
}

const installer: Installer = program => {
    program.command('db:reset')
        .description('Re-creates the local database')
        .option('-m, --migrate', 'Run migrations afterwards')
        .option('-s, --seed', 'Seed the database afterwards')
        .option('-t, --typegen', 'Generate types afterwards')
        .action(action<Options>(async ({opts}) => {
            const cmd = [
                'supabase',
                'db',
                'reset',
            ]

            cmd.push(opts.linked ? '--linked' : '--local')

            await bunx(cmd, {})

            if (opts.migrate) {
                await migrate('up')
            }

            if (opts.seed) {
                await seed()
            }

            if (opts.typegen) {
                await generateTypes(opts)
            }
        }))
}

export default installer
