import { useDashboard } from "@/hooks/useDashboard";

import { CategoriesSection } from "./categories-section";
import { RecentTransactions } from "./recent-transactions";
import { SummaryCards } from "./summary-cards";

export function Dashboard() {
  const { summary, transactions, categories, isLoading, error } =
    useDashboard();

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-destructive">Erro ao carregar dados</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 sm:gap-6 sm:p-8">
      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-6">
        <div className="lg:col-span-3">
          <RecentTransactions transactions={transactions} />
        </div>

        <div className="lg:col-span-2">
          <CategoriesSection categories={categories} />
        </div>
      </div>
    </div>
  );
}
