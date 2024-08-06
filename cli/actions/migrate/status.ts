import { log, table } from 'console'
import dayjs from 'dayjs'
import { Client } from 'pg'
import { countMigrations } from '.'
import type { GlobalOptions, Installer } from '../../types'
import { action, supabaseStatus } from '../../utils'

type Row = {
    name: string
    run_on: string
}

type Options = GlobalOptions & {}

const installer: Installer = program => {
    program.command('migrate:status')
        .description('Shows ran migrations')
        .action(action<Options>(async ({ opts }) => {
            const { DB_URL } = await supabaseStatus(opts.linked)
            const client = new Client(DB_URL)
            await client.connect()

            const res = await client.query('select name, run_on from supabase_migrations.node_pg_migrations order by run_on asc')

            const totalMigrations = await countMigrations()
            const pending = totalMigrations - (res.rowCount ?? 0)

            if (pending > 0) {
                log(`${pending} migration(s) pending.`)
                log('Run `./artisan migrate` to apply them.')
                log()
            }

            if ((res.rowCount ?? 0) > 0) {
                table(res.rows.map<Row>(row => ({ name: row.name.slice(18), run_on: dayjs(row.run_on).format('DD.MM.YYYY HH:mm:ss.SSS (Z)') })))
            }

            await client.end()
        }))
}

export default installer
