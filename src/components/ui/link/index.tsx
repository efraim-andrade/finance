import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const linkVariants = cva(
  [
    "inline-flex items-center gap-1 text-sm font-medium",
    "text-brand-base",
    "cursor-pointer",
    "transition-all outline-none",
    "focus-visible:underline focus-visible:underline-offset-4",
  ],
  {
    variants: {
      underline: {
        always: "underline underline-offset-4",
        hover:
          "no-underline border-b border-b-transparent hover:border-b-brand-base",
        never: "no-underline",
      },
    },
    defaultVariants: {
      underline: "hover",
    },
  },
);

type LinkProps = React.ComponentProps<"a"> &
  VariantProps<typeof linkVariants> & {
    asChild?: boolean;
  };

function Link({ asChild = false, className, underline, ...props }: LinkProps) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="link"
      data-underline={underline ?? "hover"}
      className={cn(linkVariants({ underline, className }))}
      {...props}
    />
  );
}

export { Link, linkVariants };
