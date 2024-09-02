import Container from '@/components/Container.tsx'
import { supabase } from '@/components/supabase/client.ts'
import { useSupabase } from '@/components/supabase/Provider.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'

export default function PageHome() {
    const { session } = useSupabase()

    return (
        <Container className='pt-24'>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Hallo, {session!.user.email}
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                    <p>
                        Lorem ipsum dolor sit amet.
                    </p>

                    <Button
                        variant="outline"
                        onClick={() => supabase.auth.signOut({ scope: 'local' })}
                    >
                        Sign out
                    </Button>
                </CardContent>
            </Card>
        </Container>
    )
}
