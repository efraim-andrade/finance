import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { DateInput } from "#/components/ui/date-input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "#/components/ui/dialog";
import { Field } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { MoneyInput } from "#/components/ui/money-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { useCategoryOptions } from "#/hooks/useCategoryOptions";
import { DATE_INPUT_LENGTH, isValidDateInput } from "#/lib/date-utils";
import { cn } from "#/lib/utils";
import type { CreateTransactionInput } from "#/services/transactions";
import type { TransactionType } from "#/types/dashboard";

type NewTransactionModalProps = {
  onSubmit: (input: CreateTransactionInput) => Promise<void>;
  children: React.ReactNode;
};

export function NewTransactionModal({
  onSubmit,
  children,
}: NewTransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const categoryOptions = useCategoryOptions();

  const validateField = (field: string, value: string | number) => {
    switch (field) {
      case "description": {
        if (typeof value !== "string" || !value.trim()) {
          return "Descrição é obrigatória";
        }
        return "";
      }
      case "amount": {
        if (typeof value !== "number" || value <= 0) {
          return "Valor deve ser maior que zero";
        }
        return "";
      }
      case "date": {
        if (typeof value !== "string" || !value) {
          return "Data é obrigatória";
        }
        if (value.length === DATE_INPUT_LENGTH && !isValidDateInput(value)) {
          return "Data inválida";
        }
        return "";
      }
      case "category": {
        if (!value) {
          return "Selecione uma categoria";
        }
        return "";
      }
      default:
        return "";
    }
  };

  const setFieldValue = (field: string, value: string | number) => {
    const err = validateField(field, value);

    setFieldErrors((prev) => {
      const next = { ...prev };

      if (err) {
        next[field] = err;
      } else {
        delete next[field];
      }

      return next;
    });
  };

  const resetForm = () => {
    setType("EXPENSE");
    setDescription("");
    setDate("");
    setAmount(0);
    setCategory("");
    setFieldErrors({});
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const errors: Record<string, string> = {};

    for (const [field, value] of Object.entries({
      description,
      amount,
      date,
      category,
    })) {
      const err = validateField(field, value);
      if (err) errors[field] = err;
    }

    if (date && date.length === DATE_INPUT_LENGTH && !isValidDateInput(date)) {
      errors.date = "Data inválida";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        description,
        amount,
        type,
        category,
        date,
      });
      setOpen(false);
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao criar transação. Tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="min-w-0 overflow-x-hidden sm:max-w-[448px]">
        <DialogHeader
          title="Nova transação"
          description="Registre sua despesa ou receita"
        />

        {error && (
          <p className="px-4 pt-2 text-sm text-red-base" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex w-full min-w-0 gap-2 rounded-xl border border-border p-2">
            <button
              type="button"
              onClick={() => setType("EXPENSE")}
              className={cn(
                "flex min-w-0 flex-1 items-center justify-center gap-3 rounded-lg px-3 py-[14px] text-base font-medium transition-colors",
                type === "EXPENSE"
                  ? "border border-red-base bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-red-light"
                  : "border border-transparent text-gray-500 dark:text-gray-400",
              )}
            >
              <CircleArrowDown
                className={cn(
                  "size-4",
                  type === "EXPENSE" ? "text-red-base" : "text-gray-400",
                )}
              />
              Despesa
            </button>

            <button
              type="button"
              onClick={() => setType("INCOME")}
              className={cn(
                "flex min-w-0 flex-1 items-center justify-center gap-3 rounded-lg px-3 py-[14px] text-base font-medium transition-colors",
                type === "INCOME"
                  ? "border border-green-base bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-green-light"
                  : "border border-transparent text-gray-500 dark:text-gray-400",
              )}
            >
              <CircleArrowUp
                className={cn(
                  "size-4",
                  type === "INCOME" ? "text-green-base" : "text-gray-400",
                )}
              />
              Receita
            </button>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-4 pt-4">
            <Input
              label="Descrição"
              placeholder="Ex. Almoço"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setFieldValue("description", e.target.value);
              }}
              error={fieldErrors.description}
              required
            />

            <div className="grid min-w-0 grid-cols-2 gap-4">
              <DateInput
                label="Data"
                placeholder="DD/MM/AAAA"
                value={date}
                onChange={(v) => {
                  setDate(v);
                  setFieldValue("date", v);
                }}
                error={fieldErrors.date}
                required
              />

              <MoneyInput
                label="Valor"
                placeholder="R$ 0,00"
                value={amount}
                onChange={(v) => {
                  setAmount(v);
                  setFieldValue("amount", v);
                }}
                error={fieldErrors.amount}
                required
              />
            </div>

            <Field label="Categoria" error={fieldErrors.category}>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-r-0 border-l-0 p-0 pl-3 pr-3">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <DialogFooter className="mt-6 sm:flex-col">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
