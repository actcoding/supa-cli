import Container from '@/components/Container.tsx'
import DarkModeToggle from '@/components/DarkModeToggle.tsx'
import { supabase } from '@/components/supabase/client.ts'
import { useSupabase } from '@/components/supabase/Provider.tsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import { faSignOut } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback } from 'react'

export default function PageHome() {
    const { session } = useSupabase()
    const { toast } = useToast()

    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut({ scope: 'local' })

        if (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            })
        } else {
            toast({
                title: 'Goodbye 👋',
                description: 'Until next time.',
            })
        }
    }, [toast])

    return (<>
        <header className="w-full h-16 bg-primary-foreground text-primary">
            <div className="container mx-auto h-full flex flex-row items-center">
                <span className='font-bold text-lg'>
                    Header
                </span>

                <div className="grow"></div>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarFallback>
                                AR
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            My Account
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={signOut}
                        >
                            <FontAwesomeIcon icon={faSignOut} />
                            <span className="ml-2">
                                Sign out
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>

        <Container className='pt-24' as="main">
            <Card className='w-2/4 mx-auto'>
                <CardHeader>
                    <CardTitle>
                        Hallo, {session?.user.email}
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                    <p>
                        Lorem ipsum dolor sit amet.
                    </p>
                </CardContent>
                <CardFooter>
                    <DarkModeToggle />
                </CardFooter>
            </Card>
        </Container>
    </>)
}
