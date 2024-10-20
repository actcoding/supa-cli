import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
    insert into storage.buckets (id, name, public)
    values ('emails', 'emails', false)
    `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
    delete from storage.buckets
    where id = 'emails'
    `)
}
