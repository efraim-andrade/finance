import type { LucideIcon } from "lucide-react";
import { categoryIconMap } from "#/lib/category-icons";

export const ICON_OPTIONS: { key: string; icon: LucideIcon }[] = Object.entries(categoryIconMap).map(([key, icon]) => ({ key, icon }));

export const COLOR_OPTIONS = [
  { key: "green", color: "#16a34a" },
  { key: "blue", color: "#2563eb" },
  { key: "purple", color: "#9333ea" },
  { key: "pink", color: "#db2777" },
  { key: "red", color: "#dc2626" },
  { key: "orange", color: "#ea580c" },
  { key: "yellow", color: "#ca8a04" },
];
