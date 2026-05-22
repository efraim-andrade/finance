import { Link, useLocation } from "@tanstack/react-router";
import {
	ChevronDown,
	LayoutDashboard,
	LogOut,
	Menu,
	Tags,
	TrendingUp,
	User,
	X,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "~/components/logo";
import { ThemeSwitcher } from "~/components/theme-switcher";
import { useAuth } from "~/hooks/useAuth";
import { cn } from "~/lib/utils";

const navLinks = [
	{ to: "/app", label: "Dashboard", icon: LayoutDashboard },
	{ to: "/app/transacoes", label: "Transações", icon: TrendingUp },
	{ to: "/app/categorias", label: "Categorias", icon: Tags },
] as const;

type MobileNavProps = {
	pathname: string;
	isOpen: boolean;
	onClose: () => void;
};

function MobileNav({ pathname, isOpen, onClose }: MobileNavProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 md:hidden">
			<button
				type="button"
				aria-label="Fechar menu"
				className="absolute inset-0 cursor-pointer bg-black/40"
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
			/>

			<div className="absolute right-0 top-0 flex h-full w-64 flex-col bg-background shadow-xl">
				<div className="flex items-center justify-between border-b border-border px-4 py-4">
					<Logo />

					<button
						type="button"
						onClick={onClose}
						aria-label="Fechar menu"
					>
						<X className="size-5 text-muted-foreground" />
					</button>
				</div>

				<nav className="flex flex-col gap-1 p-4">
					{navLinks.map(({ to, label, icon: Icon }) => {
						const isActive =
							to === "/app" ? pathname === "/app" : pathname.startsWith(to);

						return (
							<Link
								key={to}
								to={to}
								onClick={onClose}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
									isActive
										? "bg-accent font-semibold text-brand-base"
										: "font-medium text-muted-foreground hover:bg-accent hover:text-foreground",
								)}
							>
								<Icon className="size-4" />
								{label}
							</Link>
						);
					})}
				</nav>
			</div>
		</div>
	);
}

type UserMenuProps = {
	isOpen: boolean;
	onClose: () => void;
	onLogout: () => void;
};

function UserMenu({ isOpen, onClose, onLogout }: UserMenuProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-10">
			<button
				type="button"
				aria-label="Fechar menu"
				className="absolute inset-0 cursor-pointer"
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
			/>
			<div
				className="absolute right-4 top-14 z-20 w-48 overflow-hidden rounded-lg border border-border bg-popover shadow-lg md:right-6"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				role="menu"
			>
				<div className="border-b border-border px-4 py-3">
					<p className="text-caption-sm font-medium text-foreground">User</p>

					<p className="text-caption-sm text-muted-foreground">
						user@email.com
					</p>
				</div>

				<Link
					to="/app/profile"
					className="flex w-full items-center gap-2 px-4 py-2 text-caption-sm text-foreground transition-colors hover:bg-accent"
					role="menuitem"
					onClick={onClose}
				>
					<User className="size-4" />
					Perfil
				</Link>

				<button
					type="button"
					className="flex w-full items-center gap-2 px-4 py-2 text-caption-sm text-foreground transition-colors hover:bg-accent"
					onClick={onLogout}
					role="menuitem"
				>
					<LogOut className="size-4" />
					Sign out
				</button>
			</div>
		</div>
	);
}

export function DashboardHeader() {
	const { logout } = useAuth();
	const [menuOpen, setMenuOpen] = useState(false);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const { pathname } = useLocation();

	return (
		<header className="flex h-16 shrink-0 items-center border-b border-border bg-background px-4 md:px-12">
			<Link to="/app" aria-label="Dashboard home" className="shrink-0">
				<Logo />
			</Link>

			{/* Desktop nav */}
			<nav className="hidden flex-1 items-center justify-center gap-5 md:flex">
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
									: "font-normal text-muted-foreground hover:text-brand-base",
							)}
						>
							<Icon className="size-4" />
							{label}
						</Link>
					);
				})}
			</nav>

			{/* Mobile hamburger */}
			<button
				type="button"
				className="ml-auto mr-2 flex items-center md:hidden"
				onClick={() => setMobileNavOpen(true)}
				aria-label="Abrir menu"
			>
				<Menu className="size-5 text-muted-foreground" />
			</button>

			<MobileNav
				pathname={pathname}
				isOpen={mobileNavOpen}
				onClose={() => setMobileNavOpen(false)}
			/>

			<div className="relative flex items-center gap-1">
				<ThemeSwitcher />

				<button
					type="button"
					className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-accent"
					onClick={() => setMenuOpen(!menuOpen)}
					aria-haspopup="true"
					aria-expanded={menuOpen}
				>
					<div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
						CT
					</div>

					<ChevronDown className="hidden size-4 text-muted-foreground md:block" />
				</button>

				<UserMenu
					isOpen={menuOpen}
					onClose={() => setMenuOpen(false)}
					onLogout={logout}
				/>
			</div>
		</header>
	);
}
