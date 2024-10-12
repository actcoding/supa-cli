import { cn } from '@/lib/utils.ts'
import { cva, VariantProps } from 'class-variance-authority'
import { ElementType, HTMLAttributes, PropsWithChildren } from 'react'
import type { Simplify } from 'type-fest'

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

type Props<T extends ElementType> = Simplify<
    PropsWithChildren<HTMLAttributes<HTMLDivElement>> &
    VariantProps<typeof containerVariants> &
    {
        as?: T
    }
>


export default function Container<T extends ElementType>({ className, variant, children, as, ...props}: Props<T>) {
    const Comp = as ?? 'div'
    return (
        <Comp
            className={cn(containerVariants({ className, variant }))}
            {...props}
        >
            {children}
        </Comp>
    )
}
