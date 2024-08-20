import type { GlobalOptions, SupabaseStatus } from '@/types.js'
import { spawn } from 'child_process'
import { Command } from 'commander'
import { readFile } from 'fs/promises'
import pg from 'pg'

export const { Client } = pg

type Action = Parameters<InstanceType<typeof Command>['action']>[0]

export function action<O extends GlobalOptions>(action: (opts: {args: any[], opts: O, cmd: Command}) => void | Promise<void>): Action {
    return async (...args) => {
        if (args.length < 2) {
            throw new Error('missing required information from commander.js?!')
        }

        let _arguments = []
        if (args.length > 2) {
            _arguments = args.splice(0, args.length - 2)
        }

        const _cmd = args[1] as Command

        await action({
            args: _arguments,
            opts: _cmd.optsWithGlobals(),
            cmd: _cmd,
        })
    }
}

type ExecOptions = {
    captureStdout?: boolean
    pipeStdin?: boolean
}

export async function exec(command: string, args: string[], opts: ExecOptions): Promise<Buffer|void> {
    return await new Promise<Buffer|void>((resolve, reject) => {
        const proc = spawn(command, args)

        if (opts.pipeStdin) {
            process.stdin.pipe(proc.stdin)
        }

        let stdout = Buffer.alloc(0)

        proc.stdout.on('data', data => {
            if (opts.captureStdout) {
                stdout = Buffer.concat([stdout, data])
            } else {
                process.stdout.write(data)
            }
        })

        proc.once('close', () => resolve(opts.captureStdout ? stdout : undefined))
        proc.once('error', reject)
    })
}

export async function bunx(args: string[], opts: ExecOptions): Promise<Buffer|void> {
    return await exec('bunx', args, opts)
}

export async function supabase(args: string[], opts: ExecOptions): Promise<Buffer|void> {
    return await bunx(['supabase', ...args], opts)
}

export async function supabaseStart(): Promise<void> {
    await supabase(['start'], { captureStdout: true })
}

/**
 * Resolves the Supabase project reference.
 *
 * @returns {string} ref The project reference.
 * @throws In case the project is not linked to a remote Supabase project.
 */
export async function supabaseProjectRef(): Promise<string> {
    const projectRef = await readFile('supabase/.temp/project-ref')
    return projectRef.toString('utf8')
}

/**
 * Resolves various variables for interacting with a Supabase instance.
 *
 * @param {boolean} linked Whether to resolve the linked remote project.
 * @returns {SupabaseStatus} status An object holding various information about the Supabase environment.
 * @example
 * `SupabaseStatus` is an object of the following shape:
 *
 * ```json
 * {
 *  "ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
 *  "API_URL": "http://127.0.0.1:54321",
 *  "DB_URL": "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
 *  "GRAPHQL_URL": "http://127.0.0.1:54321/graphql/v1",
 *  "INBUCKET_URL": "http://127.0.0.1:54324",
 *  "JWT_SECRET": "super-secret-jwt-token-with-at-least-32-characters-long",
 *  "S3_PROTOCOL_ACCESS_KEY_ID": "625729a08b95bf1b7ff351a663f3a23c",
 *  "S3_PROTOCOL_ACCESS_KEY_SECRET": "850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907",
 *  "S3_PROTOCOL_REGION": "local",
 *  "SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
 *  "STORAGE_S3_URL": "http://127.0.0.1:54321/storage/v1/s3",
 *  "STUDIO_URL": "http://127.0.0.1:54323"
 * }
 * ```
 *
 * See [the Supabase documentation](https://supabase.com/docs/reference/cli/supabase-status) for reference.
 */
export async function supabaseStatus(linked: boolean): Promise<SupabaseStatus> {
    if (linked) {
        const projectRef = await supabaseProjectRef()
        const DB_URL = (await readFile('supabase/.temp/pooler-url'))
            .toString('utf8')
            .replace('6543', '5432') // we want session mode
            .replace('[YOUR-PASSWORD]', process.env.SUPABASE_PASSWORD!)

        return {
            DB_URL,
            API_URL: `https://${projectRef}.supabase.co`,
            GRAPHQL_URL: `https://${projectRef}.supabase.co/graphql/v1`,
            STUDIO_URL: `https://supabase.com/dashboard/project/${projectRef}`,
            STORAGE_S3_URL: `https://${projectRef}.supabase.co/storage/v1/s3`,
            ANON_KEY: process.env.SUPABASE_ANON_KEY as string,
            SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_KEY as string,
        } as SupabaseStatus
    }

    const result = await supabase(['status', '-o', 'json'], { captureStdout: true }) as Buffer
    return JSON.parse(result.toString('utf8')) as SupabaseStatus
}

export async function version(): Promise<string> {
    const file = import.meta.resolve('../package.json').substring(7)
    const buffer = await readFile(file)
    const data = JSON.parse(buffer.toString('utf8'))
    return data.version as string
}
