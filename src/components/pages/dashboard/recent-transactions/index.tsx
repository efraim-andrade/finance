import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  CarFront,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  PiggyBank,
  Plus,
  ShoppingCart,
  Utensils,
} from "lucide-react";
import { useState } from "react";

import { NewTransactionModal } from "@/components/new-transaction-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/dashboard";

type RecentTransactionsProps = {
  transactions: Transaction[];
};

const iconMap: Record<string, LucideIcon> = {
  "Pagamento de Salário": BriefcaseBusiness,
  "Jantar no Restaurante": Utensils,
  "Posto de Gasolina": CarFront,
  "Compras no Mercado": ShoppingCart,
  "Retorno de Investimento": PiggyBank,
};

const colorMap: Record<string, string> = {
  green: "bg-green-light dark:bg-green-dark",
  blue: "bg-blue-light dark:bg-blue-dark",
  purple: "bg-purple-light dark:bg-purple-dark",
  orange: "bg-orange-light dark:bg-orange-dark",
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-caption-sm font-medium text-muted-foreground">
          Transações recentes
        </span>

        <Link underline="hover" className="gap-0.5 text-sm">
          Ver todas
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {transactions.map((transaction) => {
          const Icon =
            iconMap[transaction.description] ??
            (transaction.type === "INCOME" ? BriefcaseBusiness : Utensils);
          const isIncome = transaction.type === "INCOME";

          return (
            <div key={transaction.id} className="flex h-20 items-center px-6">
              <div className="flex flex-1 items-center gap-4">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    colorMap[transaction.categoryColor] ?? "bg-muted",
                  )}
                >
                  <Icon className="size-4 text-foreground" />
                </div>

                <div>
                  <p className="text-base font-medium text-foreground">
                    {transaction.description}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {transaction.date}
                  </p>
                </div>
              </div>

              <div className="flex w-40 items-center justify-center">
                <Tag variant={transaction.categoryColor}>{transaction.tag}</Tag>
              </div>

              <div className="flex w-40 items-center justify-end gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {isIncome ? "+" : "-"}
                  {transaction.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>

                {isIncome ? (
                  <CircleArrowUp className="size-4 text-green-dark dark:text-green-light" />
                ) : (
                  <CircleArrowDown className="size-4 text-red-dark dark:text-red-light" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center border-t border-border px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 text-brand-base hover:text-brand-base hover:underline"
        >
          <Plus className="size-4" />
          Nova transação
        </Button>
      </div>

      <NewTransactionModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </Card>
  );
}
