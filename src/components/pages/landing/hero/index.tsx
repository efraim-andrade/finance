import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

export function LandingHero() {
	return (
		<section className="flex flex-col items-center gap-6 px-6 py-20 md:px-30 md:py-24">
			<motion.h1
				initial={{ y: 30, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
				className="max-w-3xl text-center font-heading text-4xl font-bold leading-tight text-foreground md:text-[44px]"
			>
				Controle suas finanças
				<br />
				com inteligência
			</motion.h1>

			<motion.p
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
				className="max-w-2xl text-center text-lg text-muted-foreground"
			>
				Organize seus gastos, acompanhe suas receitas e alcance seus objetivos
				financeiros com uma plataforma simples e poderosa.
			</motion.p>

			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
				className="flex items-center gap-4"
			>
				<Link to="/criar-conta">
					<motion.button
						type="button"
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-base px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
					>
						Começar Grátis
					</motion.button>
				</Link>

				<motion.button
					type="button"
					whileHover={{ scale: 1.03 }}
					whileTap={{ scale: 0.97 }}
					className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-6 text-base font-medium text-foreground transition-colors hover:bg-accent"
				>
					Ver Demonstração
				</motion.button>
			</motion.div>

			<motion.div
				initial={{ y: 40, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
				className="mt-8 h-[360px] w-full max-w-4xl rounded-2xl border border-border bg-muted/30"
			>
				<div className="flex h-full flex-col justify-end gap-4 p-10">
					<p className="font-heading text-2xl font-semibold text-muted-foreground">
						Dashboard Preview
					</p>
					<p className="text-base text-muted-foreground/70">
						Visualize suas receitas e despesas em tempo real
					</p>
				</div>
			</motion.div>
		</section>
	);
}
