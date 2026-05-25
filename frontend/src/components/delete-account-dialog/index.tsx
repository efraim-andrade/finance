import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "#/components/ui/dialog";

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
};

export function DeleteAccountDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
}: DeleteAccountDialogProps) {
  const [step, setStep] = useState(1);

  const handleReset = () => {
    setStep(1);
    onOpenChange(false);
  };

  const handleClose = () => {
    if (loading) return;

    setStep(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 1 ? (
          <>
            <DialogHeader
              title="Excluir conta"
              description="Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão permanentemente perdidos."
            />

            <div className="mt-2 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="size-4 shrink-0" />

              <span>
                Suas transações, categorias e todas as informações serão
                excluídas permanentemente.
              </span>
            </div>
          </>
        ) : (
          <DialogHeader
            title="Última confirmação"
            description="Se você prosseguir, não será possível recuperar seus dados. Esta é sua última chance."
          />
        )}

        <DialogFooter>
          {step === 1 ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={loading}
              >
                Cancelar
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={() => setStep(2)}
                disabled={loading}
              >
                Sim, quero excluir
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Voltar
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  "Excluindo..."
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    Sim, excluir permanentemente
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
