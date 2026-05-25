import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, Trash2, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DeleteAccountDialog } from "#/components/delete-account-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

type ProfileForm = z.infer<typeof profileSchema>;

function computeInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (
    parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)
  ).toUpperCase();
}

export function EditProfile() {
  const {
    deleteAccount,
    deletingAccount,
    logout,
    userName,
    userEmail,
    updateProfile,
  } = useAuth();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { register, handleSubmit } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userName ?? "",
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    await updateProfile(data.name);
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    navigate({ to: "/" });
  };

  return (
    <div className="flex flex-1 items-start justify-center bg-background p-8">
      <div className="flex w-full max-w-md flex-col gap-8 rounded-xl border border-border bg-card p-8">
        {/* Avatar + Name + Email */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted text-2xl font-medium text-foreground">
            {computeInitials(userName)}
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <h1 className="text-xl font-semibold text-foreground">
              {userName ?? "Usuário"}
            </h1>

            <p className="text-base text-muted-foreground">
              {userEmail ?? "-"}
            </p>
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
            value={userEmail ?? "-"}
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

        {/* Danger Zone */}
        <hr className="border-border" />

        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-destructive">
            Excluir conta
          </h2>

          <p className="text-sm text-muted-foreground">
            Ao excluir sua conta, todos os seus dados serão perdidos
            permanentemente.
          </p>

          <Button
            type="button"
            size="lg"
            variant="destructive"
            className="mt-2 w-full"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="size-4" />
            Excluir conta
          </Button>
        </div>

        <DeleteAccountDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteAccount}
          loading={deletingAccount}
        />
      </div>
    </div>
  );
}
