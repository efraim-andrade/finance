import {
  type ChangeEvent,
  type ComponentProps,
  type FocusEvent,
  forwardRef,
  useState,
} from "react";
import { formatBRL, parseBRL } from "~/lib/format-brl";
import { cn, INPUT_CLASSES } from "~/lib/utils";
import { Field } from "../field";

type MoneyInputProps = Omit<
  ComponentProps<"input">,
  "type" | "onChange" | "value" | "defaultValue"
> & {
  label?: string;
  helper?: string;
  value?: number;
  onChange?: (value: number) => void;
};

const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  (
    { className, label, helper, value, onChange, onBlur, onFocus, ...props },
    ref,
  ) => {
    const [internalDisplay, setInternalDisplay] = useState(() =>
      formatBRL(value ?? 0),
    );

    const isControlled = value !== undefined;
    const displayValue = isControlled ? formatBRL(value) : internalDisplay;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const numericValue = parseBRL(e.target.value);

      if (!isControlled) {
        setInternalDisplay(formatBRL(numericValue));
      }

      onChange?.(numericValue);
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      e.target.select();
      onFocus?.(e);
    };

    return (
      <Field label={label} helper={helper}>
        <input
          type="text"
          inputMode="numeric"
          className={cn(INPUT_CLASSES, className)}
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={onBlur}
          {...props}
        />
      </Field>
    );
  },
);

MoneyInput.displayName = "MoneyInput";

export { MoneyInput };
