import type { CSSProperties } from "react";

import { useDashboard } from "@/hooks/useDashboard";

import { CategoriesSection } from "./categories-section";
import { RecentTransactions } from "./recent-transactions";
import { SummaryCards } from "./summary-cards";

export function Dashboard() {
  const {
    summary,
    transactions,
    categories,
    categoryMetaMap,
    isLoading,
    error,
  } = useDashboard();

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
    <div
      className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 sm:gap-6 sm:p-8"
      style={
        {
          "--anim-dur": "400ms",
          "--anim-ease": "cubic-bezier(0.16, 1, 0.3, 1)",
          "--anim-delay-1": "0ms",
          "--anim-delay-2": "120ms",
          "--anim-delay-3": "240ms",
        } as CSSProperties
      }
    >
      <div
        className="anim-page"
        style={{
          animation:
            "impeccable-fade-slide var(--anim-dur) var(--anim-delay-1) var(--anim-ease) both",
        }}
      >
        <SummaryCards summary={summary} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-6">
        <div
          className="lg:col-span-3 anim-page"
          style={{
            animation:
              "impeccable-fade-slide var(--anim-dur) var(--anim-delay-2) var(--anim-ease) both",
          }}
        >
          <RecentTransactions
            transactions={transactions}
            categoryMetaMap={categoryMetaMap}
          />
        </div>

        <div
          className="lg:col-span-2 anim-page"
          style={{
            animation:
              "impeccable-fade-slide var(--anim-dur) var(--anim-delay-3) var(--anim-ease) both",
          }}
        >
          <CategoriesSection categories={categories} />
        </div>
      </div>
    </div>
  );
}
