import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { Logo } from "#/components/logo";

type LandingHeaderProps = {
	onNavClick: (section: string) => void;
};

export function LandingHeader({ onNavClick }: LandingHeaderProps) {
	return (
		<motion.header
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-4 md:px-12"
		>
			<Link to="/" className="shrink-0">
				<Logo />
			</Link>

			<div className="flex items-center gap-4">
				<Link
					to="/"
					className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
				>
					Login
				</Link>

				<Link to="/criar-conta">
					<motion.button
						type="button"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-base px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
					>
						Começar Grátis
					</motion.button>
				</Link>
			</div>
		</motion.header>
	);
}
