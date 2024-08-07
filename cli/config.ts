import type { Config } from '@/types'
import { readFile } from 'fs/promises'
import { join } from 'path'

async function load<T>(file: string): Promise<T> {
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

const configFile = join(process.cwd(), '.config', 'supa-cli.json')
const data = await load<Config>(configFile)

const config = Object.assign({}, defaults, data)

export default config

export { configFile }
