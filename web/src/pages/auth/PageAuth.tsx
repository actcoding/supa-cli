import Container from '@/components/Container.tsx'
import DarkModeToggle from '@/components/DarkModeToggle.tsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import PageLogin from '@/pages/auth/PageLogin.tsx'
import PageRegister from '@/pages/auth/PageRegister.tsx'
import { ReactNode, useEffect, useMemo } from 'react'

type Tab = {
    key: string
    title: string
    subtitle?: string
    element: ReactNode
}

const tabs: Tab[] = [
    {
        key: 'login',
        title: 'Login',
        subtitle: 'Login using your existing account.',
        element: <PageLogin />,
    },
    {
        key: 'register',
        title: 'Register',
        subtitle: 'Register for a new account.',
        element: <PageRegister />,
    },
]

export default function PageAuth() {
    const defaultValue = useMemo(() => {
        const hash = window.location.hash
        if (hash.length > 0) {
            return window.location.hash.substring(1)
        } else {
            return tabs[0].key
        }
    }, [])

    useEffect(() => {
        const listener = (e: HashChangeEvent) => {
            console.log(e.newURL, e.oldURL)
        }
        window.addEventListener('hashchange', listener)

        return () => window.removeEventListener('hashchange', listener)
    }, [])

    return (
        <Container variant="centered" className='pt-24'>

            <p className="text-4xl font-bold text-primary">
                @actcoding/supa-cli
            </p>

            <Tabs
                defaultValue={defaultValue}
                className='w-[512px] mt-8 mx-auto'
                onValueChange={tab => {
                    window.location.hash = tab
                }}
            >
                <TabsList className='w-full'>
                    {tabs.map(tab => (
                        <TabsTrigger
                            key={tab.key}
                            value={tab.key}
                            className='flex-1'
                        >
                            {tab.title}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabs.map(tab => (
                    <TabsContent
                        key={tab.key}
                        value={tab.key}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {tab.title}
                                </CardTitle>
                                {tab.subtitle ? (
                                    <CardDescription>
                                        {tab.subtitle}
                                    </CardDescription>
                                ) : null}
                            </CardHeader>
                            <CardContent>
                                {tab.element}
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>

            <DarkModeToggle />

        </Container>
    )
}
