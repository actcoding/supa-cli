import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

const envSchema = z.object({
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),

    SEND_EMAIL_HOOK_SECRET: z.string(),

    SMTP_HOST: z.string(),
    SMTP_PORT: z.coerce.number().optional().default(465),
    SMTP_TLS: z.coerce.boolean().optional().default(true),
    SMTP_USER: z.string(),
    SMTP_PASSWORD: z.string(),
})

const { success, data: env, error: zodError } = envSchema.safeParse(
    Deno.env.toObject(),
)

if (!success) {
    console.error(zodError)
    throw zodError
}

export default env!
