import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/types/dashboard";

const CATEGORIES = [
  { value: "alimentacao", label: "Alimentação" },
  { value: "transporte", label: "Transporte" },
  { value: "moradia", label: "Moradia" },
  { value: "saude", label: "Saúde" },
  { value: "educacao", label: "Educação" },
  { value: "lazer", label: "Lazer" },
  { value: "salario", label: "Salário" },
  { value: "investimentos", label: "Investimentos" },
  { value: "outros", label: "Outros" },
];

type NewTransactionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NewTransactionModal({
  open,
  onOpenChange,
}: NewTransactionModalProps) {
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");

  const handleSave = () => {
    if (!description || !date || amount <= 0 || !category) {
      return;
    }

    // TODO: create transaction via Apollo mutation
    //   date is DD/MM/AAAA — convert with dateToISO() before sending
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[448px]">
        <DialogHeader
          title="Nova transação"
          description="Registre sua despesa ou receita"
        />

        <div className="flex gap-2 rounded-xl border border-border p-2">
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={cn(
              "flex flex-1 items-center justify-center gap-3 rounded-lg px-3 py-[14px] text-base font-medium transition-colors",
              type === "EXPENSE"
                ? "border border-red-base bg-gray-100 text-gray-900"
                : "border border-transparent text-gray-500",
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
              "flex flex-1 items-center justify-center gap-3 rounded-lg px-3 py-[14px] text-base font-medium transition-colors",
              type === "INCOME"
                ? "border border-green-base bg-gray-100 text-gray-900"
                : "border border-transparent text-gray-500",
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

        <div className="flex flex-col gap-4">
          <Input
            label="Descrição"
            placeholder="Ex. Almoço"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-4">
            <DateInput label="Data" value={date} onChange={setDate} />

            <MoneyInput
              label="Valor"
              placeholder="R$ 0,00"
              value={amount}
              onChange={setAmount}
            />
          </div>

          <Field label="Categoria">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-r-0 border-l-0 p-0 pl-3 pr-3">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {CATEGORIES.map((categorie) => (
                    <SelectItem key={categorie.value} value={categorie.value}>
                      {categorie.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <DialogFooter className="sm:flex-col">
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={handleSave}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
