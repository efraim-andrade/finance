import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-12">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-6 text-muted-foreground" />
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-foreground">{title}</p>

        {description && (
          <p className="text-center text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}
