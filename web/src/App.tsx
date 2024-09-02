import SupabaseProvider, { useSupabase } from '@/components/supabase/Provider.tsx'
import { Toaster } from '@/components/ui/toaster.tsx'
import PageAuth from '@/pages/auth/PageAuth.tsx'
import PageHome from '@/pages/home/PageHome.tsx'

export function Switch() {
    const { session } = useSupabase()

    if (session) {
        return <PageHome />
    }

    return <PageAuth />
}

export default function App() {
    return (<>
        <SupabaseProvider>
            <Switch />
        </SupabaseProvider>
        <Toaster />
    </>)
}
