import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Plus,
  Receipt,
} from "lucide-react";
import { EmptyState } from "#/components/empty-state";
import { NewTransactionModal } from "#/components/new-transaction-modal";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Tag } from "#/components/ui/tag";
import { useAuth } from "#/hooks/useAuth";
import { useTransactions } from "#/hooks/useTransactions";
import type { CategoryMeta } from "#/lib/category-utils";
import { getCategoryMeta } from "#/lib/category-utils";
import { cn } from "#/lib/utils";
import type { CreateTransactionInput } from "#/services/transactions";
import type { Transaction } from "#/types/dashboard";

type RecentTransactionsProps = {
  transactions: Transaction[];
  categoryMetaMap: Record<string, CategoryMeta>;
};

export function RecentTransactions({
  transactions,
  categoryMetaMap,
}: RecentTransactionsProps) {
  const { userId } = useAuth();
  const { createTransaction } = useTransactions();

  const handleCreate = async (
    input: Omit<CreateTransactionInput, "userId">,
  ) => {
    await createTransaction({ ...input, userId: userId! });
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-caption-sm font-medium text-muted-foreground">
          Transações recentes
        </span>

        <Link
          to="/app/transacoes"
          className="inline-flex items-center gap-0.5 text-sm font-medium text-brand-base transition-all outline-none hover:underline focus-visible:underline"
        >
          Ver todas
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {transactions.length > 0 ? (
          transactions.map((transaction) => {
            const { iconBg, iconColor, Icon, variant } = getCategoryMeta(
              transaction.category,
              categoryMetaMap,
            );
            const isIncome = transaction.type === "INCOME";

            return (
              <div key={transaction.id} className="flex h-20 items-center px-6">
                <div className="flex flex-1 items-center gap-4">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg",
                      iconBg,
                    )}
                  >
                    <Icon className={cn("size-4", iconColor)} />
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
                  <Tag variant={variant}>{transaction.category}</Tag>
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
          })
        ) : (
          <EmptyState
            icon={Receipt}
            title="Nenhuma transação ainda"
            description="Crie sua primeira transação para começar a controlar suas finanças"
            action={
              <NewTransactionModal onSubmit={handleCreate}>
                <Button size="sm" className="gap-1.5">
                  <Plus className="size-4" />
                  Nova transação
                </Button>
              </NewTransactionModal>
            }
          />
        )}
      </div>

      {transactions.length > 0 && (
        <div className="flex justify-center border-t border-border px-6 py-3">
          <NewTransactionModal onSubmit={handleCreate}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-brand-base hover:text-brand-base hover:underline"
            >
              <Plus className="size-4" />
              Nova transação
            </Button>
          </NewTransactionModal>
        </div>
      )}
    </Card>
  );
}
