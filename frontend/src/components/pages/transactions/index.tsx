import { Plus, Receipt, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "#/components/empty-state";
import { NewTransactionModal } from "#/components/new-transaction-modal";
import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { useAuth } from "#/hooks/useAuth";
import { useTransactionPeriods } from "#/hooks/useTransactionPeriods";
import {
  type TransactionFilters,
  useTransactions,
} from "#/hooks/useTransactions";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "#/services/transactions";
import type { Transaction } from "#/types/dashboard";
import { DeleteDialog } from "./delete-dialog";
import { EditTransactionModal } from "./edit-transaction-modal";
import { Filters } from "./filters";
import { Pagination } from "./pagination";
import { TransactionRow } from "./transaction-row";

const RESULTS_PER_PAGE = 10;

const SKELETON_IDS = Array.from({ length: 5 }, (_, i) => `skeleton-${i}`);

export function TransactionsPage() {
  const { userId } = useAuth();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const transactionFilters: TransactionFilters = {};

  if (periodFilter !== "all") {
    const [month, year] = periodFilter.split("/");

    transactionFilters.month = month;
    transactionFilters.year = year;
  }

  const {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    categoryMetaMap,
    deleteExampleTransactions,
    deleteExamplesLoading,
  } = useTransactions(transactionFilters);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteExamplesDialog, setShowDeleteExamplesDialog] =
    useState(false);
  const [isDeletingExamples, setIsDeletingExamples] = useState(false);

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

    return result;
  }, [transactions, search, typeFilter, categoryFilter]);

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
    await createTransaction({ ...input, userId: userId! });
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
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteExamples = () => {
    setShowDeleteExamplesDialog(true);
  };

  const confirmDeleteExamples = async () => {
    if (!userId) return;

    setIsDeletingExamples(true);

    try {
      await deleteExampleTransactions(userId);

      setShowDeleteExamplesDialog(false);
    } finally {
      setIsDeletingExamples(false);
    }
  };

  const hasExamples = transactions.some((t) => "isExample" in t && t.isExample);

  const periodOptions = useTransactionPeriods(userId ?? undefined);

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
          {SKELETON_IDS.map((id) => (
            <div
              key={id}
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
      <PageHeader
        title="Transações"
        description="Gerencie todas as suas transações financeiras"
        action={
          <div className="flex items-center gap-2">
            {hasExamples && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={handleDeleteExamples}
                  disabled={deleteExamplesLoading}
                >
                  <Trash2 className="size-4" />
                  <span className="hidden sm:inline">Remover exemplos</span>
                  <span className="sm:hidden">Exemplos</span>
                </Button>
                <DeleteDialog
                  open={showDeleteExamplesDialog}
                  onOpenChange={setShowDeleteExamplesDialog}
                  onConfirm={confirmDeleteExamples}
                  loading={isDeletingExamples}
                  title="Remover transações de exemplo"
                  description="Tem certeza que deseja remover todas as transações de exemplo? Suas transações reais não serão afetadas."
                />
              </>
            )}
            <NewTransactionModal onSubmit={handleCreate}>
              <Button size="sm" className="gap-1.5">
                <Plus className="size-4" />
                <span className="hidden sm:inline">Nova transação</span>
                <span className="sm:hidden">Nova</span>
              </Button>
            </NewTransactionModal>
          </div>
        }
      />

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
          periodOptions={periodOptions}
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
              categoryMetaMap={categoryMetaMap}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <EmptyState
            icon={Receipt}
            title="Nenhuma transação encontrada"
            description="Tente ajustar os filtros ou criar uma nova transação"
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
