import { ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "#/hooks/useAuth";

export function DashboardHeader() {
	const { logout } = useAuth();
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6">
			<div className="flex items-center gap-2">
				<div className="flex size-8 items-center justify-center rounded-lg bg-brand-base">
					<span className="text-sm font-bold text-white">F</span>
				</div>

				<span className="text-heading-md font-bold text-foreground">
					Finance
				</span>
			</div>

			<div className="relative flex items-center gap-3">
				<button
					type="button"
					className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-accent"
					onClick={() => setMenuOpen(!menuOpen)}
					aria-haspopup="true"
					aria-expanded={menuOpen}
				>
					<div className="flex size-8 items-center justify-center rounded-full bg-brand-dark text-xs font-medium text-white">
						U
					</div>

					<ChevronDown className="size-4 text-muted-foreground" />
				</button>

				{menuOpen && (
					// biome-ignore lint/a11y/noStaticElementInteractions: backdrop for closing dropdown
					<div
						className="fixed inset-0 z-10"
						onClick={() => setMenuOpen(false)}
						onKeyDown={(e) => {
							if (e.key === "Escape") setMenuOpen(false);
						}}
					>
						<div
							className="absolute right-6 top-14 z-20 w-48 overflow-hidden rounded-lg border border-border bg-popover shadow-lg"
							onClick={(e) => e.stopPropagation()}
							onKeyDown={(e) => e.stopPropagation()}
							role="menu"
						>
							<div className="border-b border-border px-4 py-3">
								<p className="text-caption-sm font-medium text-foreground">
									User
								</p>

								<p className="text-caption-sm text-muted-foreground">
									user@email.com
								</p>
							</div>

							<button
								type="button"
								className="flex w-full items-center gap-2 px-4 py-2 text-caption-sm text-foreground transition-colors hover:bg-accent"
								onClick={logout}
								role="menuitem"
							>
								<LogOut className="size-4" />
								Sign out
							</button>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
