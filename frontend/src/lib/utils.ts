import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const INPUT_CLASSES =
  "min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm pl-3";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
