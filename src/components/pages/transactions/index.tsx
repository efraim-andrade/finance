import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "~/components/ui/button";

import { allTransactions, type Transaction } from "./data";
import { Filters } from "./filters";
import { NewTransactionModal } from "./new-transaction-modal";
import { Pagination } from "./pagination";
import { TransactionRow } from "./transaction-row";

const RESULTS_PER_PAGE = 10;

export function TransactionsPage() {
	const [transactions, setTransactions] =
		useState<Transaction[]>(allTransactions);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [periodFilter, setPeriodFilter] = useState("11/2025");
	const [currentPage, setCurrentPage] = useState(1);

	const filtered = useMemo(() => {
		let result = [...transactions];

		if (search.trim()) {
			const term = search.toLowerCase();

			result = result.filter((t) => t.description.toLowerCase().includes(term));
		}

		if (typeFilter !== "all") {
			result = result.filter((t) => t.type === typeFilter);
		}

		if (categoryFilter !== "all") {
			result = result.filter((t) => t.category === categoryFilter);
		}

		if (periodFilter) {
			const [month, year] = periodFilter.split("/");

			result = result.filter((t) => {
				const [_day, tMonth, tYear] = t.date.split("/");

				return tMonth === month && tYear === year;
			});
		}

		return result;
	}, [transactions, search, typeFilter, categoryFilter, periodFilter]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / RESULTS_PER_PAGE));
	const safePage = Math.min(currentPage, totalPages);

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [currentPage, totalPages]);

	const paginated = useMemo(() => {
		const start = (safePage - 1) * RESULTS_PER_PAGE;

		return filtered.slice(start, start + RESULTS_PER_PAGE);
	}, [filtered, safePage]);

	const handleDelete = (id: string) => {
		setTransactions((prev) => prev.filter((t) => t.id !== id));
	};

	return (
		<div className="flex flex-1 flex-col gap-8 bg-gray-100 p-12">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-0.5">
					<h1 className="text-heading-md font-bold text-gray-800">
						Transações
					</h1>

					<p className="text-body-md text-gray-600">
						Gerencie todas as suas transações financeiras
					</p>
				</div>

				<NewTransactionModal
					onAdd={(t) => setTransactions((prev) => [t, ...prev])}
				>
					<Button size="sm" className="gap-1.5">
						<Plus className="size-4" />
						Nova transação
					</Button>
				</NewTransactionModal>
			</div>

			<div className="rounded-xl border border-gray-200 bg-white p-6">
				<Filters
					search={search}
					onSearchChange={(value) => {
						setSearch(value);
						setCurrentPage(1);
					}}
					typeFilter={typeFilter}
					onTypeFilterChange={(value) => {
						setTypeFilter(value);
						setCurrentPage(1);
					}}
					categoryFilter={categoryFilter}
					onCategoryFilterChange={(value) => {
						setCategoryFilter(value);
						setCurrentPage(1);
					}}
					periodFilter={periodFilter}
					onPeriodFilterChange={(value) => {
						setPeriodFilter(value);
						setCurrentPage(1);
					}}
				/>
			</div>

			<div className="rounded-xl border border-gray-200 bg-white">
				<div className="flex h-14 items-center border-b border-gray-200 px-6">
					<div className="flex flex-1 items-center">
						<span className="text-xs font-medium uppercase tracking-wider text-gray-500">
							Descrição
						</span>
					</div>

					<div className="flex w-28 items-center justify-center">
						<span className="text-xs font-medium uppercase tracking-wider text-gray-500">
							Data
						</span>
					</div>

					<div className="flex w-52 items-center justify-center">
						<span className="text-xs font-medium uppercase tracking-wider text-gray-500">
							Categoria
						</span>
					</div>

					<div className="flex w-36 items-center justify-center">
						<span className="text-xs font-medium uppercase tracking-wider text-gray-500">
							Tipo
						</span>
					</div>

					<div className="flex w-52 items-center justify-end">
						<span className="text-xs font-medium uppercase tracking-wider text-gray-500">
							Valor
						</span>
					</div>

					<div className="flex w-28 items-center justify-end">
						<span className="text-xs font-medium uppercase tracking-wider text-gray-500">
							Ações
						</span>
					</div>
				</div>

				{paginated.length > 0 ? (
					paginated.map((transaction) => (
						<TransactionRow
							key={transaction.id}
							transaction={transaction}
							onDelete={handleDelete}
						/>
					))
				) : (
					<div className="flex h-40 items-center justify-center">
						<p className="text-sm text-gray-500">
							Nenhuma transação encontrada
						</p>
					</div>
				)}

				<Pagination
					currentPage={safePage}
					totalPages={totalPages}
					totalResults={filtered.length}
					resultsPerPage={RESULTS_PER_PAGE}
					onPageChange={setCurrentPage}
				/>
			</div>
		</div>
	);
}
