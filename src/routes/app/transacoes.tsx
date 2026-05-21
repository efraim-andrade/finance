import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/transacoes")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div />;
}
