import config from '@/config.js'
import type { GlobalOptions, Installer } from '@/types.js'
import { action, supabase } from '@/utils.js'
import { writeFile } from 'fs/promises'

type Options = GlobalOptions & {
}

const installer: Installer = program => {
    program.command('db:typegen')
        .description('Generate types from the database schema')
        .option('--linked', 'Generate types from the linked database instead of the local one')
        .action(action(async ({ opts }) => await generateTypes(opts)))
}

export default installer

export async function generateTypes(opts: Options): Promise<void> {
    const files = config.typeFiles

    const cmd = [
        'gen',
        'types',
        '--schema', 'public',
        '--lang', 'typescript'
    ]

    cmd.push(opts.linked ? '--linked' : '--local')
    if (opts.verbose) {
        cmd.push('--debug')
    }

    const types = await supabase(cmd, { captureStdout: true, pipeStdin: true }) as Buffer
    const processed = convertUnionToEnums(types.toString('utf8'))
    await Promise.all(files.map(file => writeFile(file, processed)))
}

function removeIndentation(input: string): string {
    return input.split('\n')
        .map(s => s.substring(6))
        .join('\n')
        .trim()
}

// Function to convert union types to enums
function convertUnionToEnums(input: string) {
    // Regex to locate the Enums object within the public namespace and capture its content
    const enumsRegex = /Enums:\s*{([^}]*)}/g
    let enumsMatch = enumsRegex.exec(input)

    if (!enumsMatch) {
        throw new Error('Enums object not found')
    }

    let enumsContent = removeIndentation(enumsMatch[1])
    const unionRegex = /(\w+):\s*((?:"[^"]*"(?:\s*\|\s*"[^"]*")*)|(?:\n\s*\|\s*"[^"]*")+)/g
    const matches = [...enumsContent.matchAll(unionRegex)]
    let enums = ''

    // Extracting the union types and generating enums
    for (let match of matches) {
        const enumName = match[1]
        const unionValues = match[2]
            .split('|')
            .map(val => val.trim().replace(/"/g, ''))
            .filter(Boolean)

        // Generate Enum
        enums += `export enum ${enumName} {\n`
        unionValues.forEach(value => {
            enums += `  '${value}' = '${value}',\n`
        })
        enums += '}\n\n'

        // Replace union type with keyof typeof Enum in enumsContent
        const unionRegex = new RegExp(`(\\b${enumName}\\b):\\s*((?:"[^"]*"(?:\\s*\\|\\s*"[^"]*")*)|(?:\\n\\s*\\|\\s*"[^"]*")+)`, 'g')
        enumsContent = enumsContent.replace(unionRegex, `$1: keyof typeof ${enumName}`)
    }

    // Replace the original Enums content with updated enumsContent in the inputType
    const updatedType = input.replace(enumsMatch[1], enumsContent)

    return enums + updatedType
}
