import { z } from 'zod'
import { countMigrations, migrate } from '.'
import { globalOptionsSchema, type Installer } from '../../types'
import { action } from '../../utils'

const total = await countMigrations()

const optionsSchema = globalOptionsSchema.extend({
    count: z.coerce.number().min(1).max(total),
    all: z.boolean(),
})

type Options = z.infer<typeof optionsSchema>

const installer: Installer = program => {
    program.command('migrate:rollback')
        .description('Rollback the last database migration')
        .option('--count <count>', `The amount of migrations to rollback (max ${total})`, '1')
        .option('--all', 'Rollback all migrations', false)
        .action(action<Options>(async ({ opts }) => {
            const result = await optionsSchema.safeParseAsync(opts)
            if (!result.success) {
                console.error(result.error.message)
                return
            }

            const { count } = result.data

            await migrate('down', opts.linked, { count: opts.all ? total : count })
        }))
}

export default installer
