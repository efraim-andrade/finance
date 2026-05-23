import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { LIST_CATEGORIES } from "#/services/categories";

export function useCategoryOptions(): { label: string; value: string }[] {
  const { data } = useQuery(LIST_CATEGORIES);

  const options = useMemo(
    () =>
      (data?.categories ?? []).map((category) => ({
        label: category.name,
        value: category.name,
      })),
    [data],
  );

  return options;
}
