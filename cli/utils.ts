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

export async function supabaseProjectRef(): Promise<string> {
    const projectRef = await readFile('supabase/.temp/project-ref')
    return projectRef.toString('utf8')
}

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
