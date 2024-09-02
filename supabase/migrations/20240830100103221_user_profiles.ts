import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('profile', {
        user_id: {
            type: 'uuid',
            notNull: true,
            references: '"auth"."users"',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        firstname: {
            type: 'text',
            notNull: true,
        },
        lastname: {
            type: 'text',
            notNull: true,
        },
    })
    pgm.createIndex('profile', 'user_id')
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('profile', 'user_id')
    pgm.dropTable('profile')
}
