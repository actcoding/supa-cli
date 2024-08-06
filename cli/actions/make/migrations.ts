import { log } from 'console'
import dayjs from 'dayjs'
import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import type { Installer } from '../../types'
import { MIGRATIONS_DIRECTORY } from '../migrate'
import { mkdir } from 'fs/promises'

const template = `
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    // TODO: Implement
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    // TODO: Implement
}
`

const installer: Installer = program => {
    program.command('make:migration')
        .description('Create a new migration')
        .argument('<name>', 'The migration name')
        .action(async (name: string) => {
            const timestamp = dayjs().format('YYYYMMDDHHmmssSSS')
            const filename = `${timestamp}_${name}.ts`
            const path = resolve(MIGRATIONS_DIRECTORY, filename)

            await mkdir(MIGRATIONS_DIRECTORY, { recursive: true })
            await writeFile(path, template.trim())

            log(`Created new migration file at ${path}`)
        })
}

export default installer
