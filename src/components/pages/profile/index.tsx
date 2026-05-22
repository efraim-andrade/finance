import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, UserRoundPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const profileSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function EditProfile() {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const { register, handleSubmit } = useForm<ProfileForm>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: "Conta teste",
		},
	});

	const onSubmit = (_data: ProfileForm) => {
		// TODO: persist profile changes via API
	};

	const handleLogout = () => {
		logout();
		navigate({ to: "/" });
	};

	return (
		<div className="flex flex-1 items-start justify-center bg-background p-8">
			<div className="flex w-full max-w-md flex-col gap-8 rounded-xl border border-border bg-card p-8">
				{/* Avatar + Name + Email */}
				<div className="flex flex-col items-center gap-6">
					<div className="flex size-16 items-center justify-center rounded-full bg-muted text-2xl font-medium text-foreground">
						CT
					</div>

					<div className="flex flex-col items-center gap-0.5">
						<h1 className="text-xl font-semibold text-foreground">
							Conta teste
						</h1>

						<p className="text-base text-muted-foreground">conta@teste.com</p>
					</div>
				</div>

				<hr className="border-border" />

				{/* Form */}
				<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
					<Input
						label="Nome completo"
						placeholder="Seu nome"
						{...register("name")}
					/>

					<Input
						label="E-mail"
						value="conta@teste.com"
						disabled
						helper="O e-mail não pode ser alterado"
					/>

					{/* Actions */}
					<div className="flex flex-col gap-4">
						<Button type="submit" size="lg" className="w-full">
							<UserRoundPlus className="size-4" />
							Salvar alterações
						</Button>

						<Button
							type="button"
							size="lg"
							variant="outline"
							className="w-full"
							onClick={handleLogout}
						>
							<LogOut className="size-4 text-destructive" />
							Sair da conta
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
