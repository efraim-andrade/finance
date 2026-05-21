import { motion } from "motion/react";

const benefits = [
	{
		title: "100% Gratuito",
		description:
			"Sem taxas escondidas nem planos pagos. Todas as funcionalidades disponíveis desde o primeiro dia.",
	},
	{
		title: "Dados Seguros",
		description:
			"Suas informações financeiras são criptografadas e armazenadas com segurança.",
	},
	{
		title: "Interface Simples",
		description:
			"Design intuitivo e fácil de usar. Você não precisa ser especialista em finanças.",
	},
];

export function LandingBenefits() {
	return (
		<section className="flex flex-col items-center gap-12 bg-muted/30 px-6 py-20 md:px-30">
			<motion.h2
				initial={{ y: 30, opacity: 0 }}
				whileInView={{ y: 0, opacity: 1 }}
				viewport={{ once: true, margin: "-80px" }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="max-w-xl text-center font-heading text-3xl font-semibold text-foreground md:text-[32px]"
			>
				Por que escolher a Finance?
			</motion.h2>

			<div className="flex w-full max-w-3xl flex-col gap-12">
				{benefits.map((benefit, index) => (
					<motion.div
						key={benefit.title}
						initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
						whileInView={{ x: 0, opacity: 1 }}
						viewport={{ once: true, margin: "-60px" }}
						transition={{
							duration: 0.5,
							delay: index * 0.15,
							ease: "easeOut",
						}}
						className="flex items-start gap-4"
					>
						<motion.div
							whileHover={{ scale: 1.15, backgroundColor: "#dcfce7" }}
							transition={{ duration: 0.2 }}
							className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-foreground"
								aria-hidden="true"
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						</motion.div>

						<div className="flex flex-col gap-2">
							<h3 className="text-base font-semibold text-foreground">
								{benefit.title}
							</h3>
							<p className="max-w-md text-sm leading-relaxed text-muted-foreground">
								{benefit.description}
							</p>
						</div>
					</motion.div>
				))}
			</div>
		</section>
	);
}
