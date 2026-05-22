import { Link } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { FieldType } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { LabelButton } from "~/components/ui/label-button";
import { useAuth } from "~/hooks/useAuth";

export function Login() {
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		login(email, password);
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-8">
			<Logo />

			<Card className="w-full max-w-sm">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2 text-center">
						<h1 className="text-heading-md font-bold text-foreground">
							Fazer login
						</h1>

						<p className="text-caption-sm text-muted-foreground">
							Entre na sua conta para continuar
						</p>
					</div>

					<div className="space-y-4">
						<Input
							label="E-mail"
							type={FieldType.email}
							placeholder="mail@exemplo.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<div className="space-y-4">
							<Input
								label="Senha"
								placeholder="Digite sua senha"
								type={FieldType.password}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>

							<div className="flex items-center justify-between gap-4">
								<label
									htmlFor="remember-me"
									className="flex cursor-pointer items-center gap-2"
								>
									<Checkbox
										id="remember-me"
										checked={rememberMe}
										onCheckedChange={(checked) =>
											setRememberMe(checked === true)
										}
									/>

									<span className="flex h-4 items-center text-caption-sm text-muted-foreground">
										Lembrar-me
									</span>
								</label>

								<Button variant="link" size="sm" className="h-auto p-0" asChild>
									<Link to="/recuperar-senha">Recuperar senha</Link>
								</Button>
							</div>
						</div>
					</div>

					<Button type="submit" className="w-full">
						Entrar
					</Button>

					<div className="relative flex items-center">
						<div className="grow border-t border-border" />

						<span className="px-3 text-caption-sm text-muted-foreground">
							ou
						</span>

						<div className="grow border-t border-border" />
					</div>

					<div className="space-y-3 text-center">
						<p className="text-caption-sm text-muted-foreground">
							Ainda não tem uma conta?
						</p>

						<LabelButton variant="secondary" className="w-full" icon={UserPlus}>
							<Link to="/criar-conta">Criar conta</Link>
						</LabelButton>
					</div>
				</form>
			</Card>
		</main>
	);
}
