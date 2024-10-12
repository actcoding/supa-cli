import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
    beforeLoad: ({ location, context }) => {
        const { session } = context.supabase
        if (!session) {
            throw redirect({
                to: '/auth/login',
                search: {
                    // Use the current location to power a redirect after login
                    // (Do not use `router.state.resolvedLocation` as it can
                    // potentially lag behind the actual current location)
                    redirect: location.href,
                },
            })
        }
    },
})
