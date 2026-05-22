import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const tagVariants = cva(
	[
		"inline-flex items-center rounded-full px-3 py-0.5",
		"text-sm font-medium leading-5",
		"transition-colors",
	],
	{
		variants: {
			variant: {
				gray: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
				blue: "bg-blue-light text-blue-dark dark:bg-blue-dark dark:text-blue-light",
				purple:
					"bg-purple-light text-purple-dark dark:bg-purple-dark dark:text-purple-light",
				pink: "bg-pink-light text-pink-dark dark:bg-pink-dark dark:text-pink-light",
				red: "bg-red-light text-red-dark dark:bg-red-dark dark:text-red-light",
				orange:
					"bg-orange-light text-orange-dark dark:bg-orange-dark dark:text-orange-light",
				yellow:
					"bg-yellow-light text-yellow-dark dark:bg-yellow-dark dark:text-yellow-light",
				green:
					"bg-green-light text-green-dark dark:bg-green-dark dark:text-green-light",
			},
		},
		defaultVariants: {
			variant: "gray",
		},
	},
);

type TagProps = React.ComponentProps<"span"> & VariantProps<typeof tagVariants>;

function Tag({ className, variant, ...props }: TagProps) {
	return (
		<span
			data-slot="tag"
			data-variant={variant ?? "gray"}
			className={cn(tagVariants({ variant, className }))}
			{...props}
		/>
	);
}

export { Tag, tagVariants };
