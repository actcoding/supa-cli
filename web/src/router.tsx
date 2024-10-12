import { useSupabase } from '@/components/supabase/Provider.tsx'
import { routeTree } from '@/routeTree.gen.ts'
import { useQueryClient } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { useEffect } from 'react'

export type AppRouterContext = {
    supabase: ReturnType<typeof useSupabase>
    queryClient: ReturnType<typeof useQueryClient>
}

const router = createRouter({
    routeTree,
    context: {
        supabase: undefined!,
        queryClient: undefined!,
    },
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export default function AppRouter() {
    const supabase = useSupabase()
    const queryClient = useQueryClient()

    useEffect(() => {
        const { data: { subscription } } = supabase.client.auth.onAuthStateChange(() => router.invalidate())

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase])

    return (
        <RouterProvider
            router={router}
            context={{ supabase, queryClient }}
        />
    )
}
