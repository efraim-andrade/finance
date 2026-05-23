import { Moon, Sun } from "lucide-react";

import { useTheme } from "~/hooks/useTheme";
import { cn } from "~/lib/utils";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      className={cn(
        "flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors",
        "hover:bg-accent",
      )}
    >
      <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </button>
  );
}
