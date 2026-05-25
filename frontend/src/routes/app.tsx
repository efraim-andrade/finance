import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { AuthLayout } from "~/components/layouts/auth-layout";
import { loadAuth, useAuth } from "~/hooks/useAuth";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (!loadAuth().isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
