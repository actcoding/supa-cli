import type { GlobalOptions, Installer } from '@/types.js'
import { action, supabaseStatus } from '@/utils.js'
import input from '@inquirer/input'
import password from '@inquirer/password'
import { createClient } from '@supabase/supabase-js'
import { log } from 'console'
import { decodeJwt } from 'jose'

type Options = GlobalOptions & {
    decode: boolean
}

const installer: Installer = program => {
    program.command('auth:jwt')
        .description('Login to Supabase and retrieve the JWT')
        .option('--decode', 'Prints the decoded payload', false)
        .action(action<Options>(async ({ opts }) => {
            const { API_URL, ANON_KEY } = await supabaseStatus(opts.linked)
            const supabase = createClient(API_URL, ANON_KEY)

            const res = await supabase.auth.signInWithPassword({
                email: await input({ message: 'E-mail address: ' }),
                password: await password({ message: 'Password: ' }),
            })

            if (res.error) {
                console.error(`Error: ${res.error.message} (HTTP ${res.error.status})`)
                return
            }

            if (opts.decode) {
                const payload = decodeJwt(res.data.session.access_token)
                log(payload)
            } else {
                log(res.data.session.access_token)
            }

            const signout = await supabase.auth.admin.signOut(res.data.session.access_token, 'local')
            if (signout.error) {
                console.error(signout.error.message)
            }
        }))
}

export default installer
