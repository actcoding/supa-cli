import { supabase } from '@/components/supabase/client.ts'
import { Button } from '@/components/ui/button.tsx'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import { cn } from '@/lib/utils.ts'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: 'custom',
            message: 'The passwords did not match',
            path: ['confirmPassword'],
        })
    }
})

type FormSchema = z.infer<typeof formSchema>

export default function PageRegister() {
    const { toast } = useToast()
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const submit = useMutation({
        mutationFn: async (values: FormSchema) => {
            const { error, data } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
                options: {
                    emailRedirectTo: import.meta.env.BASE_URL,
                    data: {
                        firstname: values.firstname,
                        lastname: values.lastname,
                    },
                },
            })

            if (error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                })
            } else {
                const mustConfirm = data.session === null
                const message = mustConfirm
                    ? 'An account has been created. Check your emails to confirm it.'
                    : 'An account has been created. You may login now.'

                toast({
                    title: 'Success',
                    description: message,
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
                    name="firstname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Firstname
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Lastname
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Confirm Password
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
                    variant={submit.isPending ? 'outline' : 'default'}
                    disabled={submit.isPending}
                >
                    <span>Register</span>
                    <FontAwesomeIcon
                        icon={faRotate}
                        className={cn('ml-1', { 'hidden': !submit.isPending })}
                        spin
                    />
                </Button>
            </form>
        </Form>
    )
}
