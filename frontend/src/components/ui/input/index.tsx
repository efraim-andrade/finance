import { Eye, EyeClosed } from "lucide-react";
import * as React from "react";
import { cn } from "~/lib/utils";
import { Field, FieldType } from "../field";

type InputProps = Omit<React.ComponentProps<"input">, "type"> & {
  label?: string;
  helper?: string;
  type?: FieldType | string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, helper, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const hasIcon =
      type === FieldType.email ||
      type === FieldType.password ||
      type === FieldType.user;
    const nativeType =
      type === FieldType.password && showPassword ? "text" : type;

    return (
      <Field label={label} helper={helper} type={type}>
        <input
          type={nativeType}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            hasIcon ? "pl-8" : "pl-3",
            type === FieldType.password && "pr-8",
          )}
          ref={ref}
          {...props}
        />

        {type === FieldType.password && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&>svg]:size-4"
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </button>
        )}
      </Field>
    );
  },
);

Input.displayName = "Input";

export { Input };
