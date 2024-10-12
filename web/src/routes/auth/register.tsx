import PageRegister from '@/pages/auth/PageRegister.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/register')({
    component: () => <PageRegister />,
})
