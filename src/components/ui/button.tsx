import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-bold font-mono uppercase tracking-wider transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-2 border-foreground",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:translate-y-0 active:shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:translate-y-0 active:shadow-none",
        outline:
          "bg-background text-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:translate-y-0 active:shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:translate-y-0 active:shadow-none",
        ghost:
          "border-transparent hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline border-none shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-sm px-3 text-xs",
        lg: "h-12 rounded-sm px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
