import type { LucideIcon } from "lucide-react";
import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Ticket,
  Utensils,
  Wrench,
} from "lucide-react";

export const categoryIconMap: Record<string, LucideIcon> = {
  baggage: BaggageClaim,
  book: BookOpen,
  briefcase: BriefcaseBusiness,
  car: CarFront,
  cart: ShoppingCart,
  dumbbell: Dumbbell,
  gift: Gift,
  heart: HeartPulse,
  house: House,
  mailbox: Mailbox,
  paw: PawPrint,
  piggy: PiggyBank,
  receipt: ReceiptText,
  ticket: Ticket,
  utensils: Utensils,
  wrench: Wrench,
};

export type CategoryIconKey = keyof typeof categoryIconMap;
