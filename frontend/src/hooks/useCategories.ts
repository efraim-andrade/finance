import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { useAuth } from "#/hooks/useAuth";
import { LIST_CATEGORIES } from "#/services/categories";
import { GET_TRANSACTIONS } from "#/services/transactions";
import type { CategoryDetail } from "#/types/dashboard";

type CategoryCountSource = {
  category: string;
};

type CategoryStats = {
  totalCategories: number;
  totalTransactions: number;
  mostUsedCategory: CategoryDetail;
};

type UseCategoriesResult = {
  categories: CategoryDetail[];
  stats: CategoryStats;
  isLoading: boolean;
  error: Error | undefined;
};

export function buildCategoryItemCountMap(
  transactions: CategoryCountSource[],
): Map<string, number> {
  const counts = new Map<string, number>();

  for (const transaction of transactions) {
    const currentCount = counts.get(transaction.category) ?? 0;

    counts.set(transaction.category, currentCount + 1);
  }

  return counts;
}

export function selectMostUsedCategory(
  categories: CategoryDetail[],
): CategoryDetail | null {
  return categories.reduce<CategoryDetail | null>(
    (currentMostUsed, category) => {
      if (category.itemCount <= 0) {
        return currentMostUsed;
      }

      if (!currentMostUsed || category.itemCount > currentMostUsed.itemCount) {
        return category;
      }

      return currentMostUsed;
    },
    null,
  );
}

export function useCategories(): UseCategoriesResult {
  const { userId } = useAuth();

  const { data, loading, error } = useQuery(LIST_CATEGORIES, {
    skip: !userId,
  });
  const {
    data: transactionData,
    loading: transactionsLoading,
    error: transactionsError,
  } = useQuery(GET_TRANSACTIONS, {
    skip: !userId,
  });

  const categoryItemCountMap = useMemo(
    () => buildCategoryItemCountMap(transactionData?.transactions.nodes ?? []),
    [transactionData],
  );

  const categories: CategoryDetail[] = useMemo(
    () =>
      (data?.categories ?? []).map(
        (cat: {
          id: string;
          name: string;
          description: string;
          color: string;
          icon: string;
          userId?: string | null;
        }): CategoryDetail => ({
          id: cat.id,
          name: cat.name,
          description: cat.description ?? "",
          color: cat.color as CategoryDetail["color"],
          icon: cat.icon,
          userId: cat.userId,
          itemCount: categoryItemCountMap.get(cat.name) ?? 0,
        }),
      ),
    [data, categoryItemCountMap],
  );

  const mostUsedCategory = selectMostUsedCategory(categories);

  const stats: CategoryStats = {
    totalCategories: categories.length,
    totalTransactions: categories.reduce((sum, cat) => sum + cat.itemCount, 0),
    mostUsedCategory: mostUsedCategory ?? {
      id: "",
      name: "Nenhuma",
      description: "",
      color: "gray",
      icon: "tag",
      itemCount: 0,
    },
  };

  return {
    categories,
    stats,
    isLoading: loading || transactionsLoading,
    error: error ?? transactionsError ?? undefined,
  };
}
