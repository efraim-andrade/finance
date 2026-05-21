import { Link, useLocation } from "@tanstack/react-router";
import {
	ChevronDown,
	LayoutDashboard,
	LogOut,
	Tags,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "#/components/logo";
import { useAuth } from "#/hooks/useAuth";
import { cn } from "#/lib/utils";

const navLinks = [
	{ to: "/app", label: "Dashboard", icon: LayoutDashboard },
	{ to: "/app/transacoes", label: "Transações", icon: TrendingUp },
	{ to: "/app/categorias", label: "Categorias", icon: Tags },
] as const;

export function DashboardHeader() {
	const { logout } = useAuth();
	const [menuOpen, setMenuOpen] = useState(false);
	const { pathname } = useLocation();

	return (
		<header className="flex h-16 shrink-0 items-center border-b border-gray-200 bg-white px-12">
<Link to="/app" aria-label="Dashboard home">
	<Logo />
</Link>

			<nav className="flex flex-1 items-center justify-center gap-5">
				{navLinks.map(({ to, label, icon: Icon }) => {
					const isActive =
						to === "/app" ? pathname === "/app" : pathname.startsWith(to);

					return (
						<Link
							key={to}
							to={to}
							className={cn(
								"flex items-center gap-1.5 text-sm transition-colors",
								isActive
									? "font-semibold text-brand-base"
									: "font-normal text-gray-600 hover:text-brand-base",
							)}
						>
							<Icon className="size-4" />
							{label}
						</Link>
					);
				})}
			</nav>

			<div className="relative flex items-center gap-3">
				<button
					type="button"
					className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-accent"
					onClick={() => setMenuOpen(!menuOpen)}
					aria-haspopup="true"
					aria-expanded={menuOpen}
				>
					<div className="flex size-8 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-800">
						CT
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
