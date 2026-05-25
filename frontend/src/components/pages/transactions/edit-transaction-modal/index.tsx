import { useState } from "react";
import { useCategoryOptions } from "#/hooks/useCategoryOptions";
import { DATE_INPUT_LENGTH, isValidDateInput } from "#/lib/date-utils";
import type { UpdateTransactionInput } from "#/services/transactions";
import type { Transaction } from "#/types/dashboard";
import { Button } from "~/components/ui/button";
import { DateInput } from "~/components/ui/date-input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "~/components/ui/dialog";
import { Field } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { MoneyInput } from "~/components/ui/money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TRANSACTION_TYPE_LABEL } from "../data";

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
  const categoryOptions = useCategoryOptions();
  const [date, setDate] = useState(transaction.date);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const validateField = (field: string, value: string | number) => {
    switch (field) {
      case "description": {
        if (typeof value !== "string" || !value.trim()) {
          return "Descrição é obrigatória";
        }
        return "";
      }
      case "value": {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const errors: Record<string, string> = {};

    for (const [field, val] of Object.entries({
      description,
      value,
      date,
      category,
    })) {
      const err = validateField(field, val);
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
              onChange={(e) => {
                setDescription(e.target.value);
                setFieldValue("description", e.target.value);
              }}
              error={fieldErrors.description}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <MoneyInput
                label="Valor"
                placeholder="0,00"
                value={value}
                onChange={(v) => {
                  setValue(v);
                  setFieldValue("value", v);
                }}
                error={fieldErrors.value}
                required
              />

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

            <Field label="Categoria" error={fieldErrors.category}>
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v);
                  setFieldValue("category", v);
                }}
              >
                <SelectTrigger id="edit-categoria">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>

                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
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
