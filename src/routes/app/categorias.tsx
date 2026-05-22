import { createFileRoute } from "@tanstack/react-router";

import { CategoriesPage } from "~/components/pages/categories";

export const Route = createFileRoute("/app/categorias")({
	component: RouteComponent,
});

function RouteComponent() {
	return <CategoriesPage />;
}
