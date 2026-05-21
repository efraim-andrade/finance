import type { ReactNode } from "react";
import { DashboardHeader } from "~/components/pages/dashboard/header";

type AuthLayoutProps = {
	children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<DashboardHeader />

			<main className="flex flex-1 flex-col">{children}</main>
		</div>
	);
}
