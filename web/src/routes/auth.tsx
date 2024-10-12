import Container from '@/components/Container.tsx'
import DarkModeToggle from '@/components/DarkModeToggle.tsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { createFileRoute, Link, Outlet, redirect, useMatches } from '@tanstack/react-router'
import { useMemo } from 'react'

export type StaticDataAuth = {
    title: string
    subtitle?: string
}

export const Route = createFileRoute('/auth')({
    beforeLoad: ({ context, location }) => {
        if (location.href === '/auth') {
            throw redirect({
                to: '/auth/login',
            })
        }

        const { session } = context.supabase
        if (session) {
            throw redirect({
                to: '/',
            })
        }
    },
    notFoundComponent: () => (
        <p className="w-full text-center">
            This page does not exist.
        </p>
    ),
    component: () => {
        const matches = useMatches()
        const page = useMemo(() => {
            if (matches.length > 0) {
                return matches[matches.length - 1]
            }
        }, [matches])

        const name = useMemo(() => {
            if (page !== undefined) {
                const segments = page.pathname.split('/')
                return segments[segments.length - 1]
            }
        }, [page])

        const staticData = useMemo(() => {
            if (page !== undefined) {
                return page.staticData as StaticDataAuth
            }
        }, [page])

        return (
            <Container variant="centered" className='pt-24'>

                <p className="text-4xl font-bold text-primary">
                    @actcoding/supa-cli
                </p>

                <div className='w-[512px] mt-8 mx-auto'>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Tabs defaultValue={name}>
                                    <TabsList className='w-full'>
                                        <TabsTrigger
                                            className='flex-1'
                                            value="login"
                                            asChild
                                        >
                                            <Link to='/auth/login'>
                                                Login
                                            </Link>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            className='flex-1'
                                            value="register"
                                            asChild
                                        >
                                            <Link to='/auth/register'>
                                                Register
                                            </Link>
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                {/* {staticData?.title} */}
                            </CardTitle>
                            {staticData?.subtitle ? (
                                <CardDescription>
                                    {staticData.subtitle}
                                </CardDescription>
                            ) : null}
                        </CardHeader>
                        <CardContent>
                            <Outlet />
                        </CardContent>
                    </Card>
                </div>

                <DarkModeToggle />

            </Container>
        )
    },
})
