import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL!

const isRemote = /^(?:https:\/\/)(?<project_ref>[\w]+)(?:\.supabase\.co)$/.test(url)

const supabase = createClient(
    url,
    import.meta.env.VITE_SUPABASE_ANON_KEY!,
)

export { supabase, isRemote }
