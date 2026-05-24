import type { LucideIcon } from "lucide-react";
import { Utensils } from "lucide-react";

import { categoryIconMap } from "#/lib/category-icons";
import type { CategoryColor, CategoryDetail } from "#/types/dashboard";

export type CategoryMeta = {
  variant: CategoryColor;
  iconBg: string;
  iconColor: string;
  Icon: LucideIcon;
};

export const COLOR_STYLES: Record<string, { bg: string; icon: string }> = {
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

export function buildCategoryMetaMap(
  categories: CategoryDetail[],
): Record<string, CategoryMeta> {
  return categories.reduce<Record<string, CategoryMeta>>((map, cat) => {
    const style = COLOR_STYLES[cat.color] ?? COLOR_STYLES.gray;
    const Icon = categoryIconMap[cat.icon] ?? Utensils;

    map[cat.name] = {
      variant: cat.color,
      iconBg: style.bg,
      iconColor: style.icon,
      Icon,
    };

    return map;
  }, {});
}

const DEFAULT_META: CategoryMeta = {
  variant: "blue",
  iconBg: "bg-blue-light dark:bg-blue-dark",
  iconColor: "text-blue-base dark:text-blue-light",
  Icon: Utensils,
};

export function getCategoryMeta(
  category: string,
  metaMap?: Record<string, CategoryMeta>,
): CategoryMeta {
  if (metaMap) {
    return metaMap[category] ?? DEFAULT_META;
  }

  return DEFAULT_META;
}
