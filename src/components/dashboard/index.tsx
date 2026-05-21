import { DashboardHeader } from "#/components/dashboard-header";

export function Dashboard() {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<DashboardHeader />

			<main className="flex flex-1 items-center justify-center p-8">
				<div className="text-center">
					<h2 className="text-heading-lg font-semibold text-foreground">
						Welcome back
					</h2>

					<p className="mt-2 text-muted-foreground">
						Your financial dashboard is ready.
					</p>
				</div>
			</main>
		</div>
	);
}
