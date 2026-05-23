import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "~/components/ui/dialog";
import { DateInput } from "~/components/ui/date-input";
import { Input } from "~/components/ui/input";
import { MoneyInput } from "~/components/ui/money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { categories, TRANSACTION_TYPE_LABEL } from "../data";
import type { UpdateTransactionInput } from "#/services/transactions";
import type { Transaction } from "#/types/dashboard";

type EditTransactionModalProps = {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: UpdateTransactionInput) => Promise<void>;
};

export function EditTransactionModal({
  transaction,
  open,
  onOpenChange,
  onSubmit,
}: EditTransactionModalProps) {
  const [description, setDescription] = useState(transaction.description);
  const [value, setValue] = useState(transaction.amount);
  const [type, setType] = useState<"INCOME" | "EXPENSE">(transaction.type);
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(transaction.date);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description || value <= 0 || !category || !date) return;

    setSaving(true);

    try {
      await onSubmit({
        description,
        amount: value,
        type,
        category,
        date,
      });
      onOpenChange(false);
    } catch {
      setError("Erro ao atualizar transação. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader title="Editar transação" />

          {error && (
            <p className="px-4 pt-2 text-sm text-red-base" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-4 py-4">
            <Input
              label="Descrição"
              placeholder="Ex: Jantar no restaurante"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <MoneyInput
                label="Valor"
                placeholder="0,00"
                value={value}
                onChange={setValue}
                required
              />

              <DateInput
                label="Data"
                placeholder="DD/MM/AAAA"
                value={date}
                onChange={setDate}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="edit-tipo"
                className="text-xs font-semibold text-foreground"
              >
                Tipo
              </label>

              <Select
                value={type}
                onValueChange={(v) => setType(v as "INCOME" | "EXPENSE")}
              >
                <SelectTrigger id="edit-tipo">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="INCOME">
                    {TRANSACTION_TYPE_LABEL.INCOME}
                  </SelectItem>
                  <SelectItem value="EXPENSE">
                    {TRANSACTION_TYPE_LABEL.EXPENSE}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="edit-categoria"
                className="text-xs font-semibold text-foreground"
              >
                Categoria
              </label>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="edit-categoria">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
