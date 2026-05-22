import { Lock, Mail, User } from "lucide-react";
import type * as React from "react";
import { cn } from "~/lib/utils";

type FieldProps = {
	label?: string;
	helper?: string;
	className?: string;
	children: React.ReactNode;
	type?: FieldType | string;
};

export enum FieldType {
	email = "email",
	password = "password",
	text = "text",
	user = "user",
}

const iconMap: Record<FieldType, React.ReactNode> = {
	[FieldType.email]: <Mail />,
	[FieldType.password]: <Lock />,
	[FieldType.text]: null,
	[FieldType.user]: <User />,
};

const Field = ({ label, helper, className, children, type }: FieldProps) => {
	const icon =
		type && type in iconMap ? (iconMap[type as FieldType] ?? null) : null;

	return (
		<div className={cn("group flex flex-col gap-1", className)}>
			{label && (
				<span className="text-xs font-semibold text-foreground group-focus-within:text-primary">
					{label}
				</span>
			)}

			<div className="relative flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
				{icon && (
					<span className="absolute left-2 text-muted-foreground group-focus-within:text-primary [&>svg]:size-4">
						{icon}
					</span>
				)}

				{children}
			</div>

			{helper && (
				<p className="text-caption-sm text-muted-foreground">{helper}</p>
			)}
		</div>
	);
};

export { Field };
