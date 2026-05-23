import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  CarFront,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  Utensils,
  Wrench,
} from "lucide-react";

export const categoryIconMap: Record<string, LucideIcon> = {
  "briefcase-business": BriefcaseBusiness,
  "car-front": CarFront,
  "heart-pulse": HeartPulse,
  "piggy-bank": PiggyBank,
  "shopping-cart": ShoppingCart,
  ticket: Ticket,
  utensils: Utensils,
  wrench: Wrench,
};

export type CategoryIconKey = keyof typeof categoryIconMap;

export type CategoryVariant =
  | "blue"
  | "purple"
  | "orange"
  | "green"
  | "yellow"
  | "pink";

type CategoryMeta = {
  variant: CategoryVariant;
  iconBg: string;
  iconColor: string;
  Icon: LucideIcon;
};

export const categoryMeta: Record<string, CategoryMeta> = {
  Alimentação: {
    variant: "blue",
    iconBg: "bg-blue-light",
    iconColor: "text-blue-base",
    Icon: Utensils,
  },
  Transporte: {
    variant: "purple",
    iconBg: "bg-purple-light",
    iconColor: "text-purple-base",
    Icon: CarFront,
  },
  Mercado: {
    variant: "orange",
    iconBg: "bg-orange-light",
    iconColor: "text-orange-base",
    Icon: ShoppingCart,
  },
  Investimento: {
    variant: "green",
    iconBg: "bg-green-light",
    iconColor: "text-green-base",
    Icon: PiggyBank,
  },
  Utilidades: {
    variant: "yellow",
    iconBg: "bg-yellow-light",
    iconColor: "text-yellow-base",
    Icon: BriefcaseBusiness,
  },
  Salário: {
    variant: "green",
    iconBg: "bg-green-light",
    iconColor: "text-green-base",
    Icon: BriefcaseBusiness,
  },
  Entretenimento: {
    variant: "pink",
    iconBg: "bg-pink-light",
    iconColor: "text-pink-base",
    Icon: Ticket,
  },
};

const DEFAULT_META: CategoryMeta = {
  variant: "blue",
  iconBg: "bg-blue-light",
  iconColor: "text-blue-base",
  Icon: Utensils,
};

export function getCategoryMeta(category: string): CategoryMeta {
  return categoryMeta[category] ?? DEFAULT_META;
}
