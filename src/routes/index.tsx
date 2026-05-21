import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "#/components/dashboard";
import { Login } from "#/components/login";
import { useAuth } from "#/hooks/useAuth";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) return <Dashboard />;

	return <Login />;
}
