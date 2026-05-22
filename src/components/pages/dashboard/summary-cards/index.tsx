import { CircleArrowDown, CircleArrowUp, Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { DashboardSummary } from "@/types/dashboard";
import { cn } from "@/lib/utils";

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
		<div className="grid grid-cols-3 gap-6">
			{cards.map(({ icon: Icon, label, formatValue, iconColor }) => (
				<Card key={label} className="p-6">
					<div className="flex items-center gap-2">
						<Icon className={cn("size-5", iconColor)} />

						<span className="text-caption-sm font-medium text-muted-foreground">
							{label}
						</span>
					</div>

					<p className="mt-4 text-heading-lg font-bold text-foreground">
						{formatValue(summary)}
					</p>
				</Card>
			))}
		</div>
	);
}
