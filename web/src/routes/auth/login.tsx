import PageLogin from '@/pages/auth/PageLogin.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
    component: () => <PageLogin />,
})
