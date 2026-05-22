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
