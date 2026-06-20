import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-br from-primary to-[hsl(var(--primary-container))] text-primary-foreground shadow-[0_14px_32px_hsl(var(--primary)/0.24)] hover:-translate-y-0.5 hover:brightness-105',
        secondary:
          'border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-strong))] text-primary shadow-sm backdrop-blur-xl hover:-translate-y-0.5 hover:bg-[hsl(var(--surface-container-lowest))]',
        outline:
          'border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] text-foreground shadow-sm backdrop-blur-xl hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[hsl(var(--glass-strong))]',
        ghost: 'text-foreground hover:bg-[hsl(var(--glass))]'
      },
      size: {
        default: 'h-10 px-4',
        icon: 'h-10 w-10 px-0',
        sm: 'h-8 px-3'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
