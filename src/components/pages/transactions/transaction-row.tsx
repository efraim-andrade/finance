import { Pencil, Trash2 } from "lucide-react";

import { IconButton } from "~/components/ui/icon-button";
import { Tag } from "~/components/ui/tag";
import { TransactionType } from "~/components/ui/transaction-type";

import type { Transaction } from "./data";

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

	return (
		<div className="flex h-[72px] items-center border-b border-gray-200 px-6">
			<div className="flex flex-1 items-center gap-4">
				<div
					className={`flex size-10 items-center justify-center rounded-lg ${iconBg}`}
				>
					<Icon className={`size-4 ${iconColor}`} />
				</div>

				<span className="text-sm font-medium text-gray-800">{description}</span>
			</div>

			<div className="flex w-28 items-center justify-center">
				<span className="text-sm text-gray-600">{date}</span>
			</div>

			<div className="flex w-52 items-center justify-center">
				<Tag variant={categoryVariant}>{category}</Tag>
			</div>

			<div className="flex w-36 items-center justify-center">
				<TransactionType variant={type}>
					{type === "income" ? "Entrada" : "Saída"}
				</TransactionType>
			</div>

			<div className="flex w-52 items-center justify-end">
				<span className="text-sm font-semibold text-gray-800">
					{formattedValue}
				</span>
			</div>

			<div className="flex w-28 items-center justify-end gap-2">
				<IconButton
					variant="danger"
					aria-label="Excluir transação"
					onClick={() => onDelete(transaction.id)}
				>
					<Trash2 className="size-4" />
				</IconButton>

				<IconButton variant="outline" aria-label="Editar transação">
					<Pencil className="size-4" />
				</IconButton>
			</div>
		</div>
	);
}
