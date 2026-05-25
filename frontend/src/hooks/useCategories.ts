import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { useAuth } from "#/hooks/useAuth";
import { LIST_CATEGORIES } from "#/services/categories";
import type { CategoryDetail } from "#/types/dashboard";

type CategoryStats = {
  totalCategories: number;
  mostUsedCategory: CategoryDetail;
};

type UseCategoriesResult = {
  categories: CategoryDetail[];
  stats: CategoryStats;
  isLoading: boolean;
  error: Error | undefined;
};

export function useCategories(): UseCategoriesResult {
  const { userId } = useAuth();

  const { data, loading, error } = useQuery(LIST_CATEGORIES, {
    variables: { userId: userId ?? undefined },
  });

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
          itemCount: 0,
        }),
      ),
    [data],
  );

  const firstCategory = categories[0];

  const stats: CategoryStats = {
    totalCategories: categories.length,
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
