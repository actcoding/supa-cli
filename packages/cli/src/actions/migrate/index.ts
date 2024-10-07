import type { GlobalOptions, Installer } from '@/types.js'
import { action, supabaseStatus } from '@/utils.js'
import { glob } from 'glob'
import { default as runner, type RunnerOption } from 'node-pg-migrate'
import type { MigrationDirection } from 'node-pg-migrate/dist/types'
import { resolve } from 'path'

type Options = GlobalOptions & {
    seed: boolean
    dryRun: boolean
}

const installer: Installer = program => {
    program.command('migrate')
        .description('Run the database migrations')
        .option('-s, --seed', 'Seed the database after migrating')
        .option('--dry-run', 'Pretend to run the migrations without actually changing anything')
        .action(action<Options>(async ({ opts }) => {
            await migrate('up', opts.linked, { dryRun: opts.dryRun })

            if (opts.seed && !opts.dryRun) {
                await seed()
            }
        }))
}

export default installer

export const MIGRATIONS_DIRECTORY = resolve('supabase/migrations')

export async function migrate(direction: MigrationDirection, linked: boolean = false, options?: Partial<RunnerOption>) {
    const { DB_URL } = await supabaseStatus(linked)
    return await runner({
        direction,
        ...options,
        databaseUrl: DB_URL,
        dir: MIGRATIONS_DIRECTORY,
        schema: 'public',
        migrationsTable: 'node_pg_migrations',
        migrationsSchema: 'supabase_migrations',
        createSchema: true,
        createMigrationsSchema: true,
        verbose: false,
    })
}

export async function seed(name: string = 'seed', linked: boolean = false) {
    const { seed } = await import(`${process.cwd()}/supabase/seeders/${name}`)
    await seed(linked)
}

export async function countMigrations(): Promise<number> {
    const files = await glob(`${MIGRATIONS_DIRECTORY}/*.ts`)
    return files.length
}
