import { log } from 'console'
import type { GlobalOptions, Installer } from '../../types'
import { action } from '../../utils'
import { writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { mkdir } from 'fs/promises'
import { stat } from 'fs/promises'
import assert from 'assert'

const config = `
[auth.email.template.invite]
content_path = "./supabase/emails/invite.mjml.html"

[auth.email.template.confirmation]
content_path = "./supabase/emails/confirmation.mjml.html"

[auth.email.template.recovery]
content_path = "./supabase/emails/recovery.mjml.html"

[auth.email.template.magic_link]
content_path = "./supabase/emails/magic_link.mjml.html"

[auth.email.template.email_change]
content_path = "./supabase/emails/email_change.mjml.html"

[auth.email.template.reauthentication]
content_path = "./supabase/emails/reauthentication.mjml.html"
`

const files = [
    'invite',
    'confirmation',
    'recovery',
    'magic_link',
    'email_change',
    'reauthentication',
]

const template = `
<mjml>
  <mj-body background-color="#f1f5f9">
    <mj-section background-color="#ffffff">
      <mj-column>

        <mj-image width="192px" src="/resources/brand-assets/supabase-logo-wordmark--light.svg"></mj-image>
        <mj-divider border-color="#3ECF8E"></mj-divider>

      </mj-column>
    </mj-section>

    <mj-section background-color="#ffffff">
    	<mj-column>
      	<mj-text font-size="20px" color="#3ECF8E" font-weight="bold">Hello World</mj-text>
        <mj-text>
        	Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
        </mj-text>

        <mj-text>
        	Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section background-color="#ffffff">
      <mj-column>

        <mj-divider border-color="#3ECF8E"></mj-divider>
        <mj-text align="center">
          Footer
        </mj-text>

      </mj-column>
    </mj-section>

    <mj-section>
      <mj-column>

        <mj-text align="center" font-size="11px">
          Copyright (c) [NAME] [YEAR]
        </mj-text>

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>

`

const directory = resolve('supabase/emails')

type Options = GlobalOptions & {}

const installer: Installer = program => {
    program.command('email:configure')
        .description('Helps with configuring email templates.')
        .action(action<Options>(async ({ opts }) => {
            await mkdir(directory, { recursive: true })

            let i = 0
            for await (const file of files) {
                const path = join(directory, `${file}.mjml`)
                if (opts.force) {
                    await writeFile(path, template)
                    i++
                    continue
                }

                try {
                    const stats = await stat(path)
                    assert(stats.isFile())
                } catch (error) {
                    await writeFile(path, template)
                    i++
                }
            }

            log(`Created ${i} missing files`)
            log()

            log('Add the following to your config.toml and then run "supa email:compile":')
            log()
            log(config)
        }))
}

export default installer
