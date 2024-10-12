import { Application } from 'https://deno.land/x/oak@v17.0.0/mod.ts'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@^2.45.4'
import compileEmail from './compiler/index.ts'
import { EmailPayload } from './compiler/types.ts'
import smtp from './smtp.ts'
import env from './config.ts'

type State = {
    supabase: SupabaseClient
    payload: EmailPayload
}

const subjects: Record<string, Record<string, string>> = {
    en: {
        signup: 'Confirm Your Email',
        recovery: 'Reset Your Password',
        invite: 'You have been invited',
        magic_link: 'Your Magic Link',
        email_change: 'Confirm Email Change',
        email_change_new: 'Confirm New Email Address',
        reauthentication: 'Confirm Reauthentication',
    },
}

const app = new Application<State>()

// verify & decode email hook data
app.use(async (ctx, next) => {
    const payload = await ctx.request.body.text()
    const headers = Object.fromEntries(ctx.request.headers)
    const base64_secret = env.SEND_EMAIL_HOOK_SECRET.substring(9)
    const wh = new Webhook(base64_secret)
    const verified = wh.verify(payload, headers) as EmailPayload

    ctx.state.payload = verified

    return next()
})

// create Supabase client
app.use((ctx, next) => {
    ctx.state.supabase = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY,
        {
            global: {
                headers: {
                    Authorization: env.SUPABASE_SERVICE_ROLE_KEY,
                },
            },
        },
    )

    return next()
})

// main handler
app.use(async (ctx) => {
    const { supabase, payload } = ctx.state

    if (!payload.user.is_anonymous) {
        const { errors, html } = await compileEmail({
            supabase,
            payload,
            bucket: 'emails', // TODO: Config
        })

        if (errors?.length ?? 0 > 0) {
            ctx.response.status = 500
            ctx.response.body = errors
            return
        }

        const language = payload.user.user_metadata.language ?? 'en'

        await smtp.send({
            from: 'noreply@axelrindle.de',
            subject: subjects[language][payload.email_data.email_action_type],
            to: payload.user.email,
            html: html!,
        })
    }

    ctx.response.status = 200
    ctx.response.body = {
        message: 'Email sent'
    }
})

await app.listen()
