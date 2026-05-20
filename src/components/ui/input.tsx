import * as React from "react";
import { cn } from "#/lib/utils";
import { Field, FieldType } from "./field";

type InputProps = React.ComponentProps<"input"> & {
	label?: string;
	helper?: string;
	type?: FieldType;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, label, helper, ...props }, ref) => {
		return (
			<Field label={label} helper={helper} type={type}>
				<input
					type={type}
					className={cn(
						"flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
						type && type !== FieldType.text ? "pl-8" : "pl-3",
					)}
					ref={ref}
					{...props}
				/>
			</Field>
		);
	},
);

Input.displayName = "Input";

export { Input };
