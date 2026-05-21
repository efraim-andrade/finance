import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Login } from "#/components/pages/login";
import { useAuth } from "#/hooks/useAuth";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate({ to: "/app" });
		}
	}, [isAuthenticated, navigate]);

	if (isAuthenticated) return null;

	return <Login />;
}
