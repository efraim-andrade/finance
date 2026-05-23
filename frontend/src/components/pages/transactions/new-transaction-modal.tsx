import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
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

import type { CreateTransactionInput } from "~/services/transactions";

import { categories, TRANSACTION_TYPE_LABEL } from "./data";

type NewTransactionModalProps = {
  onSubmit: (input: Omit<CreateTransactionInput, "userId">) => Promise<void>;
  children: React.ReactNode;
};

export function NewTransactionModal({
  onSubmit,
  children,
}: NewTransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [value, setValue] = useState(0);
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
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
      setOpen(false);
      resetForm();
    } catch {
      setError("Erro ao criar transação. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setValue(0);
    setType("EXPENSE");
    setCategory("");
    setDate("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader title="Nova transação" />

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
                htmlFor="modal-tipo"
                className="text-xs font-semibold text-foreground"
              >
                Tipo
              </label>

              <Select
                value={type}
                onValueChange={(v) => setType(v as "INCOME" | "EXPENSE")}
              >
                <SelectTrigger id="modal-tipo">
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
                htmlFor="modal-categoria"
                className="text-xs font-semibold text-foreground"
              >
                Categoria
              </label>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="modal-categoria">
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
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar transação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
