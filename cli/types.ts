import { Command } from 'commander'
import { z } from 'zod'

export const globalOptionsSchema = z.object({
    verbose: z.boolean().default(false),
    force: z.boolean().default(false),
    linked: z.boolean().default(false),
})

export type GlobalOptions = z.infer<typeof globalOptionsSchema>

export type Installer = (program: Command) => void | Promise<void>

export type InstallerModule = {
    default: Installer
}

export type SupabaseStatus = {
    ANON_KEY: string
    API_URL: string
    DB_URL: string
    GRAPHQL_URL: string
    INBUCKET_URL: string
    JWT_SECRET: string
    S3_PROTOCOL_ACCESS_KEY_ID: string
    S3_PROTOCOL_ACCESS_KEY_SECRET: string
    S3_PROTOCOL_REGION: string
    SERVICE_ROLE_KEY: string
    STORAGE_S3_URL: string
    STUDIO_URL: string
}
