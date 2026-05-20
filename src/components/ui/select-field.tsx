import type { SelectContentProps, SelectProps } from "@radix-ui/react-select";
import type * as React from "react";

import { cn } from "@/lib/utils";

import { Field, type FieldType } from "./field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "./select";

type SelectFieldProps = SelectProps & {
	contentProps?: SelectContentProps;
	label?: string;
	helper?: string;
	placeholder?: string;
	className?: string;
	children: React.ReactNode;
	type?: FieldType;
};

const SelectField = ({
	contentProps,
	label,
	helper,
	placeholder,
	className,
	children,
	type,
	...props
}: SelectFieldProps) => (
	<Field label={label} helper={helper} type={type}>
		<Select {...props}>
			<SelectTrigger
				className={cn(
					"gap-2 justify-start border-r-0 border-l-0 p-0 pl-8 pr-3 ",
					className,
				)}
			>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>

			<SelectContent {...contentProps}>{children}</SelectContent>
		</Select>
	</Field>
);

export { SelectField, SelectGroup, SelectItem, SelectLabel, SelectSeparator };
