import { createFileRoute } from "@tanstack/react-router";

import { Dashboard } from "~/components/pages/dashboard";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Dashboard />;
}
