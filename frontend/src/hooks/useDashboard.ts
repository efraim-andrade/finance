import { useQuery } from "@apollo/client/react";
import type { CategoryMeta } from "#/lib/category-utils";
import { buildCategoryMetaMap } from "#/lib/category-utils";
import { LIST_CATEGORIES } from "#/services/categories";
import { GET_TRANSACTIONS } from "#/services/transactions";
import type {
  CategoryColor,
  CategorySummary,
  DashboardSummary,
  Transaction,
} from "#/types/dashboard";
import { useAuth } from "./useAuth";

function displayDate(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function aggregateCategorySummaries(
  transactions: Transaction[],
  categoryMetaMap: Record<string, CategoryMeta>,
): CategorySummary[] {
  const map = new Map<
    string,
    { name: string; itemCount: number; total: number }
  >();

  for (const transaction of transactions) {
    const existing = map.get(transaction.category) ?? {
      name: transaction.category,
      itemCount: 0,
      total: 0,
    };

    existing.itemCount += 1;
    existing.total += transaction.amount;

    map.set(transaction.category, existing);
  }

  return Array.from(map.values()).map((entry) => ({
    ...entry,
    id: entry.name,
    color: (categoryMetaMap[entry.name]?.variant ?? "blue") as CategoryColor,
  }));
}

type UseDashboardResult = {
  summary: DashboardSummary;
  transactions: Transaction[];
  categories: CategorySummary[];
  categoryMetaMap: Record<string, CategoryMeta>;
  isLoading: boolean;
  error: Error | undefined;
};

export function useDashboard(): UseDashboardResult {
  const { userId } = useAuth();

  const {
    data: txData,
    loading: txLoading,
    error: txError,
  } = useQuery(GET_TRANSACTIONS, {
    variables: { userId: userId ?? undefined },
  });
  const { data: catData, loading: catLoading } = useQuery(LIST_CATEGORIES, {
    variables: { userId: userId ?? undefined },
  });

  const categoryMetaMap = buildCategoryMetaMap(catData?.categories ?? []);

  const allTransactions: Transaction[] = (txData?.transactions ?? []).map(
    (transaction: Transaction) => ({
      ...transaction,
      date: displayDate(transaction.date),
    }),
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyTransactions = allTransactions.filter((transaction) => {
    const [_day, month, year] = transaction.date.split("/");

    return Number(month) - 1 === currentMonth && Number(year) === currentYear;
  });

  const summary: DashboardSummary = {
    totalBalance: allTransactions.reduce(
      (acc, transaction) =>
        acc +
        (transaction.type === "INCOME"
          ? transaction.amount
          : -transaction.amount),
      0,
    ),
    monthlyIncome: monthlyTransactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce((acc, transaction) => acc + transaction.amount, 0),
    monthlyExpense: monthlyTransactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce((acc, transaction) => acc + transaction.amount, 0),
  };

  const sortedByLatest = [...allTransactions].sort((a, b) => {
    const [aDay, aMonth, aYear] = a.date.split("/");
    const [bDay, bMonth, bYear] = b.date.split("/");
    const aTime = new Date(
      Number(aYear),
      Number(aMonth) - 1,
      Number(aDay),
    ).getTime();
    const bTime = new Date(
      Number(bYear),
      Number(bMonth) - 1,
      Number(bDay),
    ).getTime();

    return bTime - aTime;
  });

  const transactions = sortedByLatest.slice(0, 10);

  const categories = aggregateCategorySummaries(
    allTransactions,
    categoryMetaMap,
  );

  return {
    summary,
    transactions,
    categories,
    categoryMetaMap,
    isLoading: txLoading || catLoading,
    error: txError ?? undefined,
  };
}
