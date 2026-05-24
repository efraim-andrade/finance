import { Pencil, Trash2, Utensils } from "lucide-react";

import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Tag } from "@/components/ui/tag";
import { categoryIconMap } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import type { CategoryColor } from "@/types/dashboard";

const iconCircleStyles: Record<CategoryColor, { bg: string; icon: string }> = {
  gray: {
    bg: "bg-gray-200 dark:bg-gray-700",
    icon: "text-gray-700 dark:text-gray-200",
  },
  blue: {
    bg: "bg-blue-light dark:bg-blue-dark",
    icon: "text-blue-base dark:text-blue-light",
  },
  purple: {
    bg: "bg-purple-light dark:bg-purple-dark",
    icon: "text-purple-base dark:text-purple-light",
  },
  pink: {
    bg: "bg-pink-light dark:bg-pink-dark",
    icon: "text-pink-base dark:text-pink-light",
  },
  red: {
    bg: "bg-red-light dark:bg-red-dark",
    icon: "text-red-base dark:text-red-light",
  },
  orange: {
    bg: "bg-orange-light dark:bg-orange-dark",
    icon: "text-orange-base dark:text-orange-light",
  },
  yellow: {
    bg: "bg-yellow-light dark:bg-yellow-dark",
    icon: "text-yellow-base dark:text-yellow-light",
  },
  green: {
    bg: "bg-green-light dark:bg-green-dark",
    icon: "text-green-base dark:text-green-light",
  },
};

type CategoryCardProps = {
  name: string;
  description: string;
  icon: string;
  color: CategoryColor;
  itemCount: number;
  isGlobal?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function CategoryCard({
  name,
  description,
  icon,
  color,
  itemCount,
  isGlobal,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const Icon = categoryIconMap[icon] ?? Utensils;
  const circleStyle = iconCircleStyles[color];

  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg",
            circleStyle.bg,
          )}
        >
          <Icon className={cn("size-4", circleStyle.icon)} />
        </div>

        <div className="flex items-center gap-2">
          {!isGlobal && (
            <IconButton
              variant="danger"
              aria-label="Excluir categoria"
              onClick={() => {
                if (window.confirm(`Excluir a categoria "${name}"?`)) {
                  onDelete?.();
                }
              }}
            >
              <Trash2 />
            </IconButton>
          )}

          <IconButton
            aria-label={isGlobal ? "Categoria global" : "Editar categoria"}
            onClick={isGlobal ? undefined : onEdit}
            disabled={isGlobal}
          >
            <Pencil />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold text-foreground">{name}</span>

        <span className="min-h-10 text-sm text-muted-foreground">
          {description}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <Tag variant={color}>{name}</Tag>

        <span className="text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "itens"}
        </span>
      </div>
    </Card>
  );
}
