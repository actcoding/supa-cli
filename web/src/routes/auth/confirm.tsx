import { supabase } from '@/components/supabase/client.ts'
import { Button } from '@/components/ui/button.tsx'
import { toast } from '@/components/ui/use-toast.ts'
import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { zodSearchValidator } from '@tanstack/router-zod-adapter'
import { z } from 'zod'

const searchSchema = z.strictObject({
    token: z.string().length(56),
})

export const Route = createFileRoute('/auth/confirm')({
    validateSearch: zodSearchValidator(searchSchema),
    loaderDeps: ({ search: { token } }) => ({ token }),
    loader: async ({ deps: { token } }) => {
        const { error } = await supabase.auth.verifyOtp({
            type: 'email',
            token_hash: token,
        })

        if (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            })
        }

        return error === null
    },
    component: () => {
        const success = useLoaderData({ from: '/auth/confirm' })

        if (success) {
            return (
                <div className="flex flex-col gap-y-6">
                    <p className="text-center">
                        Succes! Your account is active now.
                    </p>
                    <Button
                        asChild
                    >
                        <Link to="/">
                            Navigate to Dashboard
                        </Link>
                    </Button>
                </div>
            )
        }

        return (
            <p className='text-center'>Something went wrong.</p>
        )
    },
    errorComponent: () => (
        <div className="flex flex-col gap-y-8 text-center">
            <p>
                Something went wrong.
            </p>

            <Button
                variant="outline"
                asChild
            >
                <Link to='/'>
                    Go back
                </Link>
            </Button>
        </div>
    ),
})
