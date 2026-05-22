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

			result = result.filter((transaction) => transaction.description.toLowerCase().includes(term));
		}

		if (typeFilter !== "all") {
			result = result.filter((transaction) => transaction.type === typeFilter);
		}

		if (categoryFilter !== "all") {
			result = result.filter((transaction) => transaction.category === categoryFilter);
		}

		if (periodFilter) {
			const [month, year] = periodFilter.split("/");

			result = result.filter((transaction) => {
				const [_day, tMonth, tYear] = transaction.date.split("/");

				return tMonth === month && tYear === year;
			});
		}

		return result;
	}, [transactions, search, typeFilter, categoryFilter, periodFilter]);

	const totalPages = Math.ceil(filtered.length / RESULTS_PER_PAGE);
	const safePage = Math.max(1, Math.min(currentPage, totalPages));

	useEffect(() => {
		setCurrentPage((prev) => Math.min(prev, totalPages));
	}, [totalPages]);

	const paginated = useMemo(() => {
		const start = (safePage - 1) * RESULTS_PER_PAGE;

		return filtered.slice(start, start + RESULTS_PER_PAGE);
	}, [filtered, safePage]);

	const resetPage = () => setCurrentPage(1);

	const handleDelete = (id: string) => {
		setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
	};

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 md:gap-8 md:p-12">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-0.5">
					<h1 className="text-heading-md font-bold text-foreground">
						Transações
					</h1>

					<p className="text-body-md text-muted-foreground">
						Gerencie todas as suas transações financeiras
					</p>
				</div>

				<NewTransactionModal
					onAdd={(transaction) => setTransactions((prev) => [transaction, ...prev])}
				>
					<Button size="sm" className="gap-1.5">
						<Plus className="size-4" />
						<span className="hidden sm:inline">Nova transação</span>
						<span className="sm:hidden">Nova</span>
					</Button>
				</NewTransactionModal>
			</div>

			<div className="rounded-xl border border-border bg-card p-6">
				<Filters
					search={search}
					onSearchChange={(value) => {
						setSearch(value);
						resetPage();
					}}
					typeFilter={typeFilter}
					onTypeFilterChange={(value) => {
						setTypeFilter(value);
						resetPage();
					}}
					categoryFilter={categoryFilter}
					onCategoryFilterChange={(value) => {
						setCategoryFilter(value);
						resetPage();
					}}
					periodFilter={periodFilter}
					onPeriodFilterChange={(value) => {
						setPeriodFilter(value);
						resetPage();
					}}
				/>
			</div>

			<div className="rounded-xl border border-border bg-card">
				<div className="hidden h-14 items-center border-b border-border px-6 md:flex">
					<div className="flex flex-1 items-center">
						<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Descrição
						</span>
					</div>

					<div className="flex w-28 items-center justify-center">
						<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Data
						</span>
					</div>

					<div className="flex w-52 items-center justify-center">
						<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Categoria
						</span>
					</div>

					<div className="flex w-36 items-center justify-center">
						<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Tipo
						</span>
					</div>

					<div className="flex w-52 items-center justify-end">
						<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Valor
						</span>
					</div>

					<div className="flex w-28 items-center justify-end">
						<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
						<p className="text-sm text-muted-foreground">
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
