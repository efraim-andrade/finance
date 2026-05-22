import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const paginationButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-md",
    "size-8",
    "text-sm font-medium leading-none",
    "transition-all outline-none",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default:
          "border border-input bg-background text-gray-700 shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:text-gray-300 dark:hover:bg-input/50",
        active:
          "bg-brand-base text-white shadow-xs hover:bg-brand-dark dark:bg-brand-base dark:hover:bg-brand-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type PaginationButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof paginationButtonVariants> & {
    asChild?: boolean;
  };

function PaginationButton({
  asChild = false,
  className,
  variant,
  ...props
}: PaginationButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="pagination-button"
      data-variant={variant ?? "default"}
      className={cn(paginationButtonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { PaginationButton, paginationButtonVariants };
