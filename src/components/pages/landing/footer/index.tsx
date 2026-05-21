import { motion } from "motion/react";

import { Logo } from "#/components/logo";

const footerLinks = {
	produto: {
		title: "Produto",
		links: [
			{ label: "Recursos", href: "#" },
			{ label: "Preços", href: "#" },
			{ label: "FAQ", href: "#" },
		],
	},
	empresa: {
		title: "Empresa",
		links: [
			{ label: "Sobre", href: "#" },
			{ label: "Blog", href: "#" },
			{ label: "Contato", href: "#" },
		],
	},
	redes: {
		title: "Redes",
		links: [
			{ label: "Twitter", href: "#" },
			{ label: "LinkedIn", href: "#" },
			{ label: "GitHub", href: "#" },
		],
	},
};

export function LandingFooter() {
	return (
		<motion.footer
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className="flex flex-col gap-8 bg-white px-6 py-12 md:px-30"
		>
			<div className="flex w-full flex-wrap justify-between gap-12">
				<div className="flex max-w-xs flex-col gap-2">
					<Logo />
					<p className="text-sm text-gray-500">
						Controle suas finanças de forma simples e gratuita.
					</p>
				</div>

				{Object.values(footerLinks).map((group) => (
					<motion.div
						key={group.title}
						initial={{ y: 20, opacity: 0 }}
						whileInView={{ y: 0, opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4 }}
						className="flex flex-col gap-3"
					>
						<span className="text-sm font-semibold text-gray-800">
							{group.title}
						</span>
						{group.links.map((link) => (
							<a
								key={link.label}
								href={link.href}
								className="text-sm text-gray-500 transition-colors hover:text-gray-700"
							>
								{link.label}
							</a>
						))}
					</motion.div>
				))}
			</div>

			<div className="h-px w-full bg-gray-200" />

			<p className="text-center text-sm text-gray-400">
				© 2026 Finance. Todos os direitos reservados.
			</p>
		</motion.footer>
	);
}
