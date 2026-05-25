import {
  type ChangeEvent,
  type ComponentProps,
  forwardRef,
  useState,
} from "react";
import { cn, INPUT_CLASSES } from "~/lib/utils";
import { Field } from "../field";

function maskDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const parts: string[] = [];

  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));

  return parts.join("/");
}

type DateInputProps = Omit<
  ComponentProps<"input">,
  "type" | "onChange" | "value" | "defaultValue"
> & {
  label?: string;
  helper?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
};

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    { className, label, helper, error, value, onChange, onBlur, ...props },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(() =>
      value ? maskDate(value) : "",
    );

    const isControlled = value !== undefined;
    const displayValue = isControlled ? maskDate(value) : internalValue;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const masked = maskDate(e.target.value);

      if (!isControlled) {
        setInternalValue(masked);
      }

      onChange?.(masked);
    };

    return (
      <Field label={label} helper={helper} error={error}>
        <input
          type="text"
          inputMode="numeric"
          className={cn(INPUT_CLASSES, className)}
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          onBlur={onBlur}
          {...props}
        />
      </Field>
    );
  },
);

DateInput.displayName = "DateInput";

export { DateInput };
