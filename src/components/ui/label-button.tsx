import type React from "react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type LabelButtonProps = {
	children: ReactNode;
	className?: string;
	icon?: React.ElementType;
	size?: "md" | "sm";
	variant?: "primary" | "secondary";
} & Omit<ComponentProps<typeof Button>, "size" | "variant">;

function LabelButton({
	asChild,
	children,
	className,
	disabled,
	icon: Icon,
	size = "md",
	variant = "secondary",
	...props
}: LabelButtonProps) {
	return (
		<Button
			asChild={asChild}
			variant={variant === "primary" ? "default" : "outline"}
			size={size === "sm" ? "sm" : "default"}
			className={cn("gap-1.5", className)}
			disabled={disabled}
			{...props}
		>
			{!asChild && Icon && <Icon />}

			{children}
		</Button>
	);
}

export { LabelButton };
