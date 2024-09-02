import { cn } from '@/lib/utils.ts'
import { cva, VariantProps } from 'class-variance-authority'
import { HTMLAttributes, PropsWithChildren } from 'react'

const containerVariants = cva(
    'container flex flex-col gap-y-6',
    {
        variants: {
            variant: {
                default: 'items-start',
                centered: 'items-center',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
)

type Props = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & VariantProps<typeof containerVariants>

export default function Container({ className, variant, children, ...props}: Props) {
    return (
        <div
            className={cn(containerVariants({ className, variant }))}
            {...props}
        >
            {children}
        </div>
    )
}
