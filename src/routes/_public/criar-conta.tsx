import { createFileRoute } from "@tanstack/react-router";

import { Signup } from "#/components/pages/signup";

export const Route = createFileRoute("/_public/criar-conta")({
	component: Signup,
});
