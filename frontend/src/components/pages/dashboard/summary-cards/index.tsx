import { CircleArrowDown, CircleArrowUp, Wallet } from "lucide-react";

import { SummaryCard } from "@/components/ui/summary-card";
import type { DashboardSummary } from "@/types/dashboard";

type SummaryCardsProps = {
  summary: DashboardSummary;
};

const cards = [
  {
    icon: Wallet,
    label: "Saldo total",
    formatValue: (data: DashboardSummary) =>
      data.totalBalance.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    iconColor: "text-purple-dark dark:text-purple-light",
  },
  {
    icon: CircleArrowUp,
    label: "Receitas do mês",
    formatValue: (data: DashboardSummary) =>
      data.monthlyIncome.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    iconColor: "text-green-dark dark:text-green-light",
  },
  {
    icon: CircleArrowDown,
    label: "Despesas do mês",
    formatValue: (data: DashboardSummary) =>
      data.monthlyExpense.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    iconColor: "text-red-dark dark:text-red-light",
  },
] as const;

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {cards.map(({ icon: Icon, label, formatValue, iconColor }) => (
        <SummaryCard
          key={label}
          icon={Icon}
          iconColor={iconColor}
          label={label}
          value={formatValue(summary)}
          inverted
        />
      ))}
    </div>
  );
}
