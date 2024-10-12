import type { Installer } from '@/types.js'
import { action, supabaseStatus } from '@/utils.js'
import input from '@inquirer/input'
import select from '@inquirer/select'
import { createClient } from '@supabase/supabase-js'
import { readFile, stat } from 'fs/promises'
import { glob } from 'glob'
import { oraPromise } from 'ora'
import { basename, join } from 'path'

const installer: Installer = program => {
    program.command('storage:upload')
        .description('Create a new migration')
        .argument('<path>', 'The local path to upload. Files and directories are supported.')
        .argument('[bucket]', 'An optional bucket to upload to. Omit to show a selection box.')
        .argument('[destination]', 'An optional destination directory in the bucket to upload to.')
        .action(action(async ({ args, opts }) => {
            const { API_URL, SERVICE_ROLE_KEY } = await supabaseStatus(opts.linked)
            const supabase = createClient(API_URL, SERVICE_ROLE_KEY)

            let [path, bucket, destination] = args

            if (bucket === undefined) {
                const { data, error } = await supabase.storage.listBuckets()
                if (error) {
                    throw error
                }

                bucket = await select({
                    message: 'Choose a bucket to upload to',
                    choices: data.map(bucket => bucket.name),
                })
            }

            if (destination === undefined) {
                destination = await input({
                    message: 'Enter a destination directory',
                    default: '/',
                })
            }

            const files: string[] = []

            const stats = await stat(path)
            if (stats.isFile()) {
                files.push(path)
            }
            else if (stats.isDirectory()) {
                const globbed = await glob(join(path, '**/*'))
                files.push(...globbed)
            }

            let counter = 0
            for await (const file of files) {
                const data = await readFile(file)
                await oraPromise(
                    supabase.storage.from(bucket).upload(
                        join(destination, basename(file)),
                        data,
                        {
                            upsert: true,
                        },
                    ),
                    {
                        text: `Uploading file ${file} (${++counter}/${files.length}) …`,
                    },
                )
            }
        }))
}

export default installer
