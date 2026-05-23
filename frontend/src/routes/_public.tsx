import { createFileRoute, Outlet } from "@tanstack/react-router";

import { ThemeSwitcher } from "~/components/theme-switcher";

export const Route = createFileRoute("/_public")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="fixed right-4 top-4 z-50">
        <ThemeSwitcher />
      </div>

      <Outlet />
    </div>
  );
}
