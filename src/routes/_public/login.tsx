import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/login")({
	beforeLoad: () => {
		throw redirect({ to: "/" });
	},
	component: () => null,
});
