import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { useAuth } from "#/hooks/useAuth";
import { LIST_CATEGORIES } from "#/services/categories";

export function useCategoryOptions(): { label: string; value: string }[] {
  const { userId } = useAuth();

  const { data } = useQuery(LIST_CATEGORIES, {
    variables: { userId: userId ?? undefined },
  });

  const options = useMemo(
    () =>
      (data?.categories ?? []).map((category) => ({
        label: category.name ?? "",
        value: category.name ?? "",
      })),
    [data],
  );

  return options;
}
