import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
	[
		"inline-flex shrink-0 items-center justify-center rounded-md",
		"size-8",
		"transition-all outline-none",
		"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
		"disabled:pointer-events-none disabled:opacity-50",
		"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	],
	{
		variants: {
			variant: {
				outline:
					"border border-input bg-background shadow-xs text-gray-700 hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:text-gray-300 dark:hover:bg-input/50",
				danger:
					"border border-input bg-background shadow-xs text-red-base hover:bg-gray-100 dark:border-input dark:bg-input/30 dark:text-red-light dark:hover:bg-input/50",
			},
		},
		defaultVariants: {
			variant: "outline",
		},
	},
);

type IconButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof iconButtonVariants> & {
		"aria-label": string;
	};

function IconButton({
	className,
	variant,
	"aria-label": ariaLabel,
	...props
}: IconButtonProps) {
	return (
		<button
			data-slot="icon-button"
			data-variant={variant ?? "outline"}
			aria-label={ariaLabel}
			className={cn(iconButtonVariants({ variant, className }))}
			{...props}
		/>
	);
}

export { IconButton, iconButtonVariants };
