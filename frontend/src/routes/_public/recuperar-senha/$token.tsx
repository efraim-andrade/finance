import { createFileRoute } from "@tanstack/react-router";

import { ResetPassword } from "~/components/pages/reset-password";

export const Route = createFileRoute("/_public/recuperar-senha/$token")({
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useParams();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <ResetPassword token={token} />
    </main>
  );
}
