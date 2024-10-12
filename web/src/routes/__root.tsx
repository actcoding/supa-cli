import { AppRouterContext } from '@/router.tsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRouteWithContext<AppRouterContext>()({
    component: () => (<>
        <Outlet />

        <TanStackRouterDevtools />
        <ReactQueryDevtools />
    </>),
})
