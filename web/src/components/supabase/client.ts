import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL!

const isRemote = /^(?:https:\/\/)(?<project_ref>[\w]+)(?:\.supabase\.co)$/.test(url)

const supabase = createClient(
    url,
    import.meta.env.VITE_SUPABASE_ANON_KEY!,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            storage: localStorage,
            storageKey: 'supa-cli-demo-session',
        },
    },
)

export type SupabaseClient = typeof supabase

export { supabase, isRemote }
