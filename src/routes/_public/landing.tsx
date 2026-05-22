import { createFileRoute } from "@tanstack/react-router";

import { Landing } from "~/components/pages/landing";

export const Route = createFileRoute("/_public/landing")({
	component: Landing,
});
