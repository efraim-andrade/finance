import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { LIST_CATEGORIES } from "#/services/categories";
import type { CategoryDetail } from "#/types/dashboard";

type CategoryStats = {
  totalCategories: number;
  totalItems: number;
  mostUsedCategory: CategoryDetail;
};

type UseCategoriesResult = {
  categories: CategoryDetail[];
  stats: CategoryStats;
  isLoading: boolean;
  error: Error | undefined;
};

export function useCategories(): UseCategoriesResult {
  const { data, loading, error } = useQuery(LIST_CATEGORIES);

  const categories: CategoryDetail[] = useMemo(
    () =>
      (data?.categories ?? []).map((category) => ({
        ...category,
        itemCount: 0,
      })),
    [data],
  );

  const totalItems = 0;

  const firstCategory = categories[0];

  const stats: CategoryStats = {
    totalCategories: categories.length,
    totalItems,
    mostUsedCategory: firstCategory ?? {
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
    isLoading: loading,
    error: error ?? undefined,
  };
}
