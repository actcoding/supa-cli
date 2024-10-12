import PageHome from '@/pages/home/PageHome.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/')({
    component: () => <PageHome />,
})
