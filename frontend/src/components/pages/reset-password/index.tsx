import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { FieldType } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/hooks/useAuth";

const resetSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

type ResetForm = z.infer<typeof resetSchema>;

type ResetPasswordProps = {
  token: string;
};

export function ResetPassword({ token }: ResetPasswordProps) {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  async function onSubmit(data: ResetForm) {
    try {
      await resetPassword(token, data.password);

      toast.success("Senha redefinida com sucesso!");
      navigate({ to: "/" });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao redefinir senha";

      setFormError("root", { message });
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-heading-md font-bold text-foreground">
            Redefinir senha
          </h1>

          <p className="text-caption-sm text-muted-foreground">
            Escolha uma nova senha para sua conta
          </p>
        </div>

        {errors.root?.message && (
          <p className="text-sm text-red-base" role="alert">
            {errors.root.message}
          </p>
        )}

        <div className="space-y-4">
          <Input
            label="Nova senha"
            type={FieldType.password}
            placeholder="Digite sua nova senha"
            helper={
              errors.password?.message ||
              "A senha deve ter no mínimo 8 caracteres"
            }
            {...register("password")}
          />

          <Input
            label="Confirmar senha"
            type={FieldType.password}
            placeholder="Confirme sua nova senha"
            helper={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
        </Button>
      </form>
    </Card>
  );
}
