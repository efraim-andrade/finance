import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AuthLayout } from "#/components/auth-layout";
import { loadAuth } from "#/hooks/useAuth";

export const Route = createFileRoute("/app")({
	beforeLoad: () => {
		if (!loadAuth()) {
			throw redirect({ to: "/" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	);
}
