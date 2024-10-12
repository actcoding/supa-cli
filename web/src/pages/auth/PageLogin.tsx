import { supabase } from '@/components/supabase/client.ts'
import { Button } from '@/components/ui/button.tsx'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

type FormSchema = z.infer<typeof formSchema>

export default function PageLogin() {
    const { toast } = useToast()

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const submit = useMutation({
        mutationFn: async (values: FormSchema) => {
            const { error, data: { user } } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            })

            if (error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                })
            } else {
                toast({
                    title: 'Hello there ✌',
                    description: `Nice to see you, ${user?.user_metadata.firstname}.`,
                })
            }
        },
    })

    const onSubmit = useCallback((values: FormSchema) => submit.mutateAsync(values), [submit])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Email address
                            </FormLabel>
                            <FormControl>
                                <Input type='email' placeholder="john@doe.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Password
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="********" type='password' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type='submit'
                    size='lg'
                    className='w-full'
                    variant={submit.isPending ? 'link' : 'default'}
                    disabled={submit.isPending}
                >
                    Login
                </Button>
            </form>
        </Form>
    )
}
