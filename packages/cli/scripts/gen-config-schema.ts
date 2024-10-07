import { log } from 'console'
import { setProperty } from 'dot-prop'
import { readFile, writeFile } from 'fs/promises'
import { createSourceFile, ScriptTarget, SyntaxKind, type ArrayTypeNode, type Identifier, type PropertySignature, type TypeAliasDeclaration, type TypeLiteralNode } from 'typescript'

function generateSchemaArray(node: ArrayTypeNode) {
    const base = {
        type: 'array',
        items: {
            type: '',
        },
    }

    switch (node.elementType.kind) {
        case SyntaxKind.StringKeyword:
            base.items.type = 'string'
            break
        case SyntaxKind.NumberKeyword:
            base.items.type = 'number'
            break
        case SyntaxKind.ObjectKeyword:
            // FIXME: Implement
            throw new Error('Arrays of objects are not supported yet!')
        default:
            base.items.type = 'null'
            break
    }

    return base
}

function generateSchemaObject(node: TypeLiteralNode) {
    const properties: Record<string, any> = {}

    for (const member of node.members) {
        const name = member.name as Identifier
        properties[name.escapedText.toString()] = generateSchema(member as PropertySignature)
    }

    return {
        type: 'object',
        properties,
    }
}

function generateSchema(node: PropertySignature) {
    switch (node.type?.kind) {
        case SyntaxKind.ArrayType:
            return generateSchemaArray(node.type as ArrayTypeNode)
        case SyntaxKind.TypeLiteral:
            return generateSchemaObject(node.type as TypeLiteralNode)
        case SyntaxKind.BooleanKeyword:
            return {
                type: 'boolean',
            }
        case SyntaxKind.StringKeyword:
            return {
                type: 'string',
            }
        default:
            return {}
    }
}

const file = 'cli/types.ts'
const contents = await readFile(file)
const ast = createSourceFile(file, contents.toString('utf8'), ScriptTarget.ESNext)

const properties: Record<string, any> = {}

for (const element of ast.statements) {
    if (element.kind != SyntaxKind.TypeAliasDeclaration) {
        continue
    }

    const declaration = element as TypeAliasDeclaration
    if (declaration.name.escapedText === 'Config') {
        const type = declaration.type as TypeLiteralNode
        for (const member of type.members) {
            const signature = member as PropertySignature
            const name = signature.name as Identifier

            properties[name.escapedText.toString()] = generateSchema(signature)
        }
        break
    }
}

const { defaults } = await import('../cli/config.js')
function generateDefaults(object: Record<string, any>, parent?: string) {
    for (const key of Object.keys(object)) {
        //@ts-ignore
        const value = object[key]
        const type = typeof value
        const path = [parent, key].filter(k => k !== undefined).join('.')

        if (type === 'object' && !Array.isArray(value)) {
            generateDefaults(value, `${path}.properties`)
            continue
        }

        if (value !== undefined) {
            setProperty(properties, `${path}.default`, value)
        }
    }
}
generateDefaults(defaults)

const schema = {
    '$schema': 'http://json-schema.org/draft-07/schema#',
    'type': 'object',
    properties,
}

const schemaFile = 'config.schema.json'
await writeFile(schemaFile, JSON.stringify(schema, null, 2) + '\n')

log(`Wrote schema to ${schemaFile}`)
