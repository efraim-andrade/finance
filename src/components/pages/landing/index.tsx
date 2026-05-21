import { LandingBenefits } from "~/components/pages/landing/benefits";
import { LandingCTA } from "~/components/pages/landing/cta";
import { LandingFeatures } from "~/components/pages/landing/features";
import { LandingFooter } from "~/components/pages/landing/footer";
import { LandingHeader } from "~/components/pages/landing/header";
import { LandingHero } from "~/components/pages/landing/hero";

export function Landing() {
	const handleNavClick = (section: string) => {
		const el = document.getElementById(section);

		if (el) {
			el.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<LandingHeader onNavClick={handleNavClick} />

			<main className="flex-1">
				<LandingHero />
				<LandingFeatures />
				<LandingBenefits />
				<LandingCTA />
			</main>

			<LandingFooter />
		</div>
	);
}
