import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export const Route = createFileRoute("/_public/recuperar-senha")({
	component: RecuperarSenha,
});

function RecuperarSenha() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background text-foreground">
			<Card className="w-full max-w-sm space-y-6 text-center">
				<div className="space-y-2">
					<h1 className="text-heading-md font-bold text-foreground">
						Recuperar senha
					</h1>

					<p className="text-caption-sm text-muted-foreground">
						Receba um link de recuperação no seu e-mail
					</p>
				</div>

				<Button variant="link" className="h-auto p-0" asChild>
					<Link to="/">Voltar ao login</Link>
				</Button>
			</Card>
		</main>
	);
}
