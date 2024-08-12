#!/usr/bin/env bun

import 'dotenv/config'

import actions from '@/actions.js'
import { sortCommands } from '@/actions/list.js'
import { supabaseStart, supabaseStatus, version } from '@/utils.js'
import confirm from '@inquirer/confirm'
import { program } from 'commander'
import { oraPromise } from 'ora'

program.version(await version())
    .showHelpAfterError()
    .configureHelp({
        showGlobalOptions: true,
    })

program.option('-v, --verbose', 'Increase output level', false)
program.option('-f, --force', 'Force the operation to run without asking for confirmation.', false)
program.option('--linked', 'Works with the linked database instead of the local one.', false)

// show help by default
program.action(() => program.help())

for await (const action of actions) {
    await action.default(program)
}

// @ts-expect-error ignore the "readonly" to apply custom sorting
program.commands = sortCommands(program)


// ensure local Supabase environment
if (!process.env.CI && !process.env.__SCRIPT) {
    try {
        await supabaseStatus(false)
    } catch (error) {
        const answer = await confirm({
            message: 'Local Supabase environment seems stopped. Do you want to start it?',
            default: true,
        })
        if (answer) {
            await oraPromise(supabaseStart(), { text: 'Starting local Supabase …' })
        } else {
            console.error('The CLI does not work without a local Supabase environment!')
            process.exit(1)
        }
    }
}

if (!process.env.__SCRIPT) {
    await program.parseAsync(process.argv)
}

export { program }
