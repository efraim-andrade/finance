import { createFileRoute } from "@tanstack/react-router";

import { EditProfile } from "~/components/pages/profile";

export const Route = createFileRoute("/app/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EditProfile />;
}
