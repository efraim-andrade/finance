import { Mail } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  label?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    const renderIcon = () => {
      const iconMap: Record<string, React.ReactNode> = {
        email: <Mail />
      }

      return iconMap[type || "text"] || null;
    }

    const icon = renderIcon();

    return (
      <div className="group flex flex-col gap-1">
        {label && (
          <span className="text-sm text-muted-foreground group-focus-within:text-primary">
            {label}
          </span>
        )}

        <div
          className={cn(
            "flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            className,
          )}
        >
          {icon && (
            <span className="text-muted-foreground group-focus-within:text-primary [&>svg]:size-4">
              {icon}
            </span>
          )}

          <input
            type={type}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground"
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
