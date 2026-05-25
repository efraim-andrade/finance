import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { FieldType } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/hooks/useAuth";

const forgotSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  async function onSubmit(data: ForgotForm) {
    try {
      await requestPasswordReset(data.email);

      setSent(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao solicitar recuperação de senha";

      setFormError("root", { message });
    }
  }

  if (sent) {
    return (
      <Card className="w-full max-w-sm">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <CheckCircle className="size-12 text-green-base" />
          </div>

          <div className="space-y-2">
            <h1 className="text-heading-md font-bold text-foreground">
              E-mail enviado!
            </h1>

            <p className="text-caption-sm text-muted-foreground">
              Verifique sua caixa de entrada e siga as instruções para recuperar
              sua senha
            </p>
          </div>

          <Button className="w-full" asChild>
            <Link to="/">Voltar ao login</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-heading-md font-bold text-foreground">
            Recuperar senha
          </h1>

          <p className="text-caption-sm text-muted-foreground">
            Receba um link de recuperação no seu e-mail
          </p>
        </div>

        {errors.root?.message && (
          <p className="text-sm text-red-base" role="alert">
            {errors.root.message}
          </p>
        )}

        <div className="space-y-4">
          <Input
            label="E-mail"
            type={FieldType.email}
            placeholder="mail@exemplo.com"
            helper={errors.email?.message}
            {...register("email")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Recuperar senha"}
        </Button>

        <div className="relative flex items-center">
          <div className="grow border-t border-border" />

          <span className="px-3 text-caption-sm text-muted-foreground">ou</span>

          <div className="grow border-t border-border" />
        </div>

        <div className="text-center">
          <Button variant="link" className="h-auto p-0" asChild>
            <Link to="/">Voltar ao login</Link>
          </Button>
        </div>
      </form>
    </Card>
  );
}
