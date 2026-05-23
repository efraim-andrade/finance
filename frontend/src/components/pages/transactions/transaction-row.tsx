import { Pencil, Trash2 } from "lucide-react";

import { IconButton } from "~/components/ui/icon-button";
import { Tag } from "~/components/ui/tag";
import { TransactionType } from "~/components/ui/transaction-type";

import { TRANSACTION_TYPE_LABEL, type Transaction } from "./data";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type TransactionRowProps = {
  transaction: Transaction;
  onDelete: (id: string) => void;
};

export function TransactionRow({ transaction, onDelete }: TransactionRowProps) {
  const {
    description,
    date,
    category,
    categoryVariant,
    iconBg,
    iconColor,
    Icon,
    type,
    value,
  } = transaction;

  const formattedValue = currencyFormatter.format(value);

  const iconCircle = (
    <div
      className={`flex size-10 items-center justify-center rounded-lg ${iconBg}`}
    >
      <Icon className={`size-4 ${iconColor}`} />
    </div>
  );

  const actionButtons = (compact: boolean) => (
    <div className={`flex items-center ${compact ? "gap-1" : "gap-2"}`}>
      <IconButton
        variant="danger"
        aria-label="Excluir transação"
        onClick={() => onDelete(transaction.id)}
        className={compact ? "size-7" : ""}
      >
        <Trash2 className={compact ? "size-3.5" : "size-4"} />
      </IconButton>

      <IconButton
        variant="outline"
        aria-label="Editar transação"
        className={compact ? "size-7" : ""}
      >
        <Pencil className={compact ? "size-3.5" : "size-4"} />
      </IconButton>
    </div>
  );

  return (
    <>
      {/* Mobile card */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 md:hidden">
        <div className="shrink-0">{iconCircle}</div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="truncate text-sm font-medium text-foreground">
              {description}
            </span>

            {actionButtons(true)}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">{date}</span>

            <span className="text-xs text-border">|</span>

            <Tag variant={categoryVariant}>{category}</Tag>

            <span className="text-xs text-border">|</span>

            <TransactionType variant={type}>
              {TRANSACTION_TYPE_LABEL[type]}
            </TransactionType>

            <span className="ml-auto text-sm font-semibold text-foreground">
              {formattedValue}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop row */}
      <div className="hidden h-[72px] items-center border-b border-border px-6 md:flex">
        <div className="flex flex-1 items-center gap-4">
          {iconCircle}

          <span className="text-sm font-medium text-foreground">
            {description}
          </span>
        </div>

        <div className="flex w-28 items-center justify-center">
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>

        <div className="flex w-52 items-center justify-center">
          <Tag variant={categoryVariant}>{category}</Tag>
        </div>

        <div className="flex w-36 items-center justify-center">
          <TransactionType variant={type}>
            {TRANSACTION_TYPE_LABEL[type]}
          </TransactionType>
        </div>

        <div className="flex w-52 items-center justify-end">
          <span className="text-sm font-semibold text-foreground">
            {formattedValue}
          </span>
        </div>

        <div className="flex w-28 items-center justify-end">
          {actionButtons(false)}
        </div>
      </div>
    </>
  );
}
