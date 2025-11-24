import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-sm border-2 border-foreground font-bold font-mono text-sm uppercase tracking-wider outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"hover:-translate-y-0.5 bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:translate-y-0 active:shadow-none",
				destructive:
					"hover:-translate-y-0.5 bg-destructive text-destructive-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:translate-y-0 active:shadow-none",
				outline:
					"hover:-translate-y-0.5 bg-background text-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:translate-y-0 active:shadow-none",
				secondary:
					"hover:-translate-y-0.5 bg-secondary text-secondary-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:translate-y-0 active:shadow-none",
				ghost: "border-transparent hover:bg-muted hover:text-foreground",
				link: "border-none text-primary underline-offset-4 shadow-none hover:underline",
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
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			data-slot="button"
			{...props}
		/>
	);
}

export { Button, buttonVariants };
