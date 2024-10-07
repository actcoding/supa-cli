import type { GlobalOptions, Installer } from '@/types.js'
import { action, supabaseStatus } from '@/utils.js'
import { log } from 'console'

type Options = GlobalOptions & {
}

const installer: Installer = program => {
    program.command('status')
        .description('supabase status but with --linked support')
        .action(action<Options>(async ({ opts }) => {
            const props = await supabaseStatus(opts.linked)
            log(props)
        }))
}

export default installer
