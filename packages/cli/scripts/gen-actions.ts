import { log } from 'console'
import { writeFile } from 'fs/promises'
import { globSync } from 'glob'

const template = `
import type { InstallerModule } from '@/types.js'

const actions: InstallerModule[] = [
%s
]

export default actions
`

const files = globSync('./cli/actions/**/*.ts', { root: './cli/actions' })

const imports = files
    .map(file => file.replace('cli/', '@/').replace('.ts', '.js'))
    .map(file => `    await import('${file}')`)
    .join(',\n')

const result = template.replace('%s', imports)

await writeFile('./cli/actions.ts', result.trimStart())

log(`Collected ${files.length} actions to ./cli/actions.ts`)
