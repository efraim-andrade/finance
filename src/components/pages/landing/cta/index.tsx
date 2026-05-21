import { motion } from "motion/react";

export function LandingCTA() {
	return (
		<section className="flex flex-col items-center justify-center gap-6 bg-brand-base px-6 py-20 md:px-30">
			<motion.h2
				initial={{ y: 30, opacity: 0 }}
				whileInView={{ y: 0, opacity: 1 }}
				viewport={{ once: true, margin: "-60px" }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="text-center font-heading text-3xl font-semibold text-white md:text-[32px]"
			>
				Pronto para começar?
			</motion.h2>

			<motion.p
				initial={{ y: 20, opacity: 0 }}
				whileInView={{ y: 0, opacity: 1 }}
				viewport={{ once: true, margin: "-60px" }}
				transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
				className="text-center text-lg text-green-100"
			>
				Crie sua conta gratuita em menos de 2 minutos.
			</motion.p>

			<motion.button
				type="button"
				initial={{ y: 20, opacity: 0 }}
				whileInView={{ y: 0, opacity: 1 }}
				viewport={{ once: true, margin: "-60px" }}
				transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
				whileHover={{ scale: 1.04 }}
				whileTap={{ scale: 0.97 }}
				className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-semibold text-brand-base shadow-sm transition-colors hover:bg-gray-100"
			>
				Criar Conta Grátis
			</motion.button>
		</section>
	);
}
