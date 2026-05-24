import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { FieldType } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/hooks/useAuth";

const signupSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Insira um e-mail válido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type SignupForm = z.infer<typeof signupSchema>;

export function Signup() {
  const { register: signup, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupForm) {
    try {
      await signup(data.name, data.email, data.password);

      toast.success("Conta criada com sucesso!");
      navigate({ to: "/app" });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao criar conta. Tente novamente.";

      setFormError("root", { message });
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background text-foreground">
      <Logo />

      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-heading-md font-bold text-foreground">
              Criar conta
            </h1>

            <p className="text-caption-sm text-muted-foreground">
              Comece a controlar suas finanças ainda hoje
            </p>
          </div>

          {errors.root?.message && (
            <p className="text-sm text-red-base" role="alert">
              {errors.root.message}
            </p>
          )}

          <div className="space-y-4">
            <Input
              label="Nome completo"
              type={FieldType.user}
              placeholder="Seu nome completo"
              helper={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="E-mail"
              type={FieldType.email}
              placeholder="mail@exemplo.com"
              helper={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Senha"
              type={FieldType.password}
              placeholder="Digite sua senha"
              helper={
                errors.password?.message ||
                "A senha deve ter no mínimo 8 caracteres"
              }
              {...register("password")}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
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
              Já tem uma conta?
            </p>

            <Button variant="outline" className="w-full gap-1.5" asChild>
              <Link to="/">
                <LogIn />
                Fazer login
              </Link>
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
