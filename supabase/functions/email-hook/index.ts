import { Application } from 'https://deno.land/x/oak@v17.0.0/mod.ts'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import { type EmailPayload, compileEmail } from '@actcoding/supa-deno'

type State = {
    supabase: SupabaseClient
    payload: EmailPayload
}

const app = new Application<State>()

// init supabase client
app.use(async (ctx, next) => {
    try {
        ctx.state.supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: {
                        Authorization: ctx.request.headers.get('Authorization')!,
                    },
                },
            },
        )
        return await next()
    } catch (error) {
        ctx.response.status = 500
        ctx.response.body = {
            error: 'Failed to initialize Supabase client!',
            metatada: JSON.stringify(error),
        }
    }
})

// verify & decode email hook data
app.use(async (ctx, next) => {
    const payload = await ctx.request.body.text()
    const headers = Object.fromEntries(ctx.request.headers)
    const base64_secret = Deno.env.get('AUTH_SEND_EMAIL_HOOK_SECRET')!
    const wh = new Webhook(base64_secret)
    const verified = wh.verify(payload, headers) as EmailPayload

    ctx.state.payload = verified

    return await next()
})

// main handler
app.use(async (ctx) => {
    const { supabase, payload } = ctx.state

    await compileEmail({
        supabase,
        payload,
        bucket: '_emails',
    })

    ctx.response.status = 200
    ctx.response.body = {
        message: 'Email sent'
    }
})

await app.listen()
