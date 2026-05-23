import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Login } from "~/components/pages/login";
import { ThemeSwitcher } from "~/components/theme-switcher";
import { useAuth } from "~/hooks/useAuth";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/app" });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="fixed right-4 top-4 z-50">
        <ThemeSwitcher />
      </div>

      <Login />
    </div>
  );
}
