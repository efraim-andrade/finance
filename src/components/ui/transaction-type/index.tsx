import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDown, ArrowUp } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

const transactionTypeVariants = cva(
	["inline-flex items-center gap-2", "text-sm font-medium"],
	{
		variants: {
			variant: {
				income: "text-green-dark dark:text-green-light",
				expense: "text-red-dark dark:text-red-light",
			},
		},
		defaultVariants: {
			variant: "income",
		},
	},
);

type TransactionTypeProps = React.ComponentProps<"span"> &
	VariantProps<typeof transactionTypeVariants>;

const iconMap = {
	income: ArrowUp,
	expense: ArrowDown,
} as const;

function TransactionType({
	className,
	variant = "income",
	children,
	...props
}: TransactionTypeProps) {
	const Icon = iconMap[variant ?? "income"];

	return (
		<span
			data-slot="transaction-type"
			data-variant={variant ?? "income"}
			className={cn(transactionTypeVariants({ variant, className }))}
			{...props}
		>
			<Icon className="size-4" />

			{children}
		</span>
	);
}

export { TransactionType, transactionTypeVariants };
