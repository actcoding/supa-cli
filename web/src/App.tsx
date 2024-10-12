import SupabaseProvider from '@/components/supabase/Provider.tsx'
import { Toaster } from '@/components/ui/toaster.tsx'
import AppRouter from '@/router.tsx'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
    return (<>
        <SupabaseProvider>
            <QueryClientProvider client={queryClient}>
                <AppRouter />
            </QueryClientProvider>
        </SupabaseProvider>

        <Toaster />
    </>)
}
