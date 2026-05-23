import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "~/components/ui/button";

import { useAuth } from "#/hooks/useAuth";
import { useTransactions } from "#/hooks/useTransactions";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "#/services/transactions";
import type { Transaction } from "#/types/dashboard";

import { DeleteDialog } from "./delete-dialog";
import { EditTransactionModal } from "./edit-transaction-modal";
import { Filters } from "./filters";
import { NewTransactionModal } from "./new-transaction-modal";
import { Pagination } from "./pagination";
import { TransactionRow } from "./transaction-row";

const RESULTS_PER_PAGE = 10;

export function TransactionsPage() {
  const { userId } = useAuth();

  const {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

    if (periodFilter && periodFilter !== "all") {
      const [month, year] = periodFilter.split("/");

      result = result.filter((t) => {
        const parts = t.date.split("/");

        return parts[1] === month && parts[2] === year;
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

  const handleCreate = async (
    input: Omit<CreateTransactionInput, "userId">,
  ) => {
    await createTransaction({ ...input, userId: userId ?? "" });
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleEditSubmit = async (input: UpdateTransactionInput) => {
    if (!editingTransaction) return;

    await updateTransaction(editingTransaction.id, input);
    setEditingTransaction(null);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    setIsDeleting(true);

    try {
      await deleteTransaction(deletingId);
      setShowDeleteDialog(false);
      setDeletingId(null);
    } catch {
      // Error state handled by Apollo
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 md:gap-8 md:p-12">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="h-7 w-48 animate-pulse rounded bg-muted" />
            <div className="h-5 w-64 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          {Array.from({ length: 5 }).map(() => (
            <div
              key={crypto.randomUUID()}
              className="flex h-[72px] items-center border-b border-border px-6"
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="size-10 animate-pulse rounded-lg bg-muted" />
                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
              </div>

              <div className="flex w-28 items-center justify-center">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              </div>

              <div className="flex w-52 items-center justify-center">
                <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
              </div>

              <div className="flex w-36 items-center justify-center">
                <div className="h-5 w-16 animate-pulse rounded bg-muted" />
              </div>

              <div className="flex w-52 items-center justify-end">
                <div className="h-5 w-24 animate-pulse rounded bg-muted" />
              </div>

              <div className="flex w-28 items-center justify-center gap-2">
                <div className="size-8 animate-pulse rounded-md bg-muted" />
                <div className="size-8 animate-pulse rounded-md bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-4 p-4 md:p-12">
        <p className="text-body-md text-red-base">
          Erro ao carregar transações.
        </p>

        <Button variant="outline" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

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

        <NewTransactionModal onSubmit={handleCreate}>
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
              onEdit={handleEdit}
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

      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingTransaction(null);
          }}
          onSubmit={handleEditSubmit}
        />
      )}

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}
