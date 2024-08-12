import type { Installer } from '@/types.js'
import { Command } from 'commander'
import { log } from 'console'

type List = {
    application: {
        name: string
        version: string
    }
    commands: {
        name: string
        description: string
        usage: string[]
        hidden: boolean
    }[]
    namespaces: {
        id: string
        commands: string[]
    }[]
}

type CommandWithDetails = Command & {
    _name: string
    _description: string
}

export function sortCommands(program: Command): CommandWithDetails[] {
    const commands = Array.from(program.commands) as CommandWithDetails[]
    commands.sort((a, b) => {
        const nameA: string = a._name
        const nameB: string = b._name

        if (nameA.includes(':') && !nameB.includes(':')) {
            return 1
        }
        else if (!nameA.includes(':') && nameB.includes(':')) {
            return -1
        }

        return nameA.localeCompare(nameB)
    })
    return commands
}

const installer: Installer = program => {
    program.command('list')
        .description('List commands')
        .option('--format <format>', 'The output format (json)')
        .option('--short', 'To skip describing commands\' arguments')
        .action(() => {
            const commands = sortCommands(program)

            const namespaces = Array.from(new Set(commands
                .map<string>(cmd => cmd._name)
                .map(name => name.includes(':') ? name.slice(0, name.indexOf(':')) : '_global')
                .sort()
            ))

            const list: List = {
                application: {
                    name: 'Supa-charged CLI',
                    version: program.version() as string,
                },
                namespaces: namespaces.map(id => {
                    return {
                        id,
                        commands: commands
                            .filter(cmd => id == '_global' ? !cmd._name.includes(':') : cmd._name.startsWith(id))
                            .map(cmd => cmd._name)
                            .sort()
                    }
                }),
                commands: commands.map(cmd => ({
                    name: cmd._name,
                    description: cmd._description,
                    hidden: cmd._name.startsWith('_'),
                    usage: [],
                })),
            }

            log(JSON.stringify(list, null, 4))
        })
}

export default installer
