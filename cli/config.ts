import type { Config } from '@/types'
import { readFile, stat } from 'fs/promises'
import { join } from 'path'

export const locations = [
    ['.config', 'supa-cli.json'],
    ['supabase', 'supa-cli.json'],
    ['supa-cli.json'],
]

async function selectFile(): Promise<string|undefined> {
    for await (const location of locations) {
        try {
            const path = join(...location)
            const { isFile } = await stat(path)
            if (isFile()) {
                return join(process.cwd(), path)
            }
        } catch (error) {
            continue
        }
    }

    return undefined
}

async function load<T>(file?: string): Promise<T> {
    if (file === undefined) {
        return {} as T
    }

    try {
        const buffer = await readFile(file)
        return JSON.parse(buffer.toString('utf8'))
    } catch (error) {
        return {} as T
    }
}

const defaults: Config = {
    typeFiles: [
        'db.ts',
    ],
}

const configFile = await selectFile()
const data = await load<Config>(configFile)

const config = Object.assign({}, defaults, data)

export default config

export { configFile }
