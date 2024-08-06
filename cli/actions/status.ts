import type { GlobalOptions, Installer } from '@/types'
import { action, supabaseStatus } from '@/utils'
import { log } from 'console'

type Options = GlobalOptions & {
}

const installer: Installer = program => {
    program.command('status')
        .description('supabase status but with --linked support.')
        .action(action<Options>(async ({ opts }) => {
            const props = await supabaseStatus(opts.linked)
            log(props)
        }))
}

export default installer
