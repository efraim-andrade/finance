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

export const ICON_OPTIONS: { key: string; icon: LucideIcon }[] = [
  { key: "briefcase", icon: BriefcaseBusiness },
  { key: "car", icon: CarFront },
  { key: "heart", icon: HeartPulse },
  { key: "piggy", icon: PiggyBank },
  { key: "cart", icon: ShoppingCart },
  { key: "ticket", icon: Ticket },
  { key: "wrench", icon: Wrench },
  { key: "utensils", icon: Utensils },
  { key: "paw", icon: PawPrint },
  { key: "house", icon: House },
  { key: "gift", icon: Gift },
  { key: "dumbbell", icon: Dumbbell },
  { key: "book", icon: BookOpen },
  { key: "baggage", icon: BaggageClaim },
  { key: "mailbox", icon: Mailbox },
  { key: "receipt", icon: ReceiptText },
];

export const COLOR_OPTIONS = [
  { key: "green", color: "#16a34a" },
  { key: "blue", color: "#2563eb" },
  { key: "purple", color: "#9333ea" },
  { key: "pink", color: "#db2777" },
  { key: "red", color: "#dc2626" },
  { key: "orange", color: "#ea580c" },
  { key: "yellow", color: "#ca8a04" },
];
