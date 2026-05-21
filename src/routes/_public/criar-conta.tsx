import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";

export const Route = createFileRoute("/_public/criar-conta")({
	component: CriarConta,
});

function CriarConta() {
	return (
		<main className="flex min-h-screen items-center justify-center">
			<Card className="w-full max-w-sm space-y-6 text-center">
				<div className="space-y-2">
					<h1 className="text-heading-md font-bold text-foreground">
						Criar conta
					</h1>

					<p className="text-caption-sm text-muted-foreground">
						Preencha seus dados para começar
					</p>
				</div>

				<Button variant="link" className="h-auto p-0" asChild>
					<Link to="/">Voltar ao login</Link>
				</Button>
			</Card>
		</main>
	);
}
