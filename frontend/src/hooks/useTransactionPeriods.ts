import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { GET_TRANSACTION_PERIODS } from "#/services/transactions";

const MONTH_NAMES: Record<string, string> = {
  "01": "Janeiro",
  "02": "Fevereiro",
  "03": "Março",
  "04": "Abril",
  "05": "Maio",
  "06": "Junho",
  "07": "Julho",
  "08": "Agosto",
  "09": "Setembro",
  "10": "Outubro",
  "11": "Novembro",
  "12": "Dezembro",
};

export function useTransactionPeriods(
  userId?: string,
): { label: string; value: string }[] {
  const { data } = useQuery(GET_TRANSACTION_PERIODS, {
    skip: !userId,
  });

  const options = useMemo(() => {
    const periods = data?.transactionPeriods ?? [];

    return [
      { label: "Todos os períodos", value: "all" },
      ...periods.map((period) => ({
        label: `${MONTH_NAMES[period.month] ?? period.month} / ${period.year}`,
        value: `${period.month}/${period.year}`,
      })),
    ];
  }, [data]);

  return options;
}
