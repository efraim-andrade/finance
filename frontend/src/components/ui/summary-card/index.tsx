import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SummaryCardProps = {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string;
  inverted?: boolean;
};

export function SummaryCard({
  icon: Icon,
  iconColor,
  label,
  value,
  inverted,
}: SummaryCardProps) {
  const content = inverted ? (
    <>
      <span className="text-caption-sm font-medium uppercase text-muted-foreground">
        {label}
      </span>
      <p className="text-heading-lg font-bold text-foreground">{value}</p>
    </>
  ) : (
    <>
      <p className="text-heading-lg font-bold text-foreground">{value}</p>
      <span className="text-caption-sm font-medium uppercase text-muted-foreground">
        {label}
      </span>
    </>
  );

  return (
    <Card data-slot="summary-card" className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex size-8 items-center justify-center">
          <Icon className={cn("size-5", iconColor)} />
        </div>

        <div className="flex flex-col gap-1 pt-0.5">{content}</div>
      </div>
    </Card>
  );
}
