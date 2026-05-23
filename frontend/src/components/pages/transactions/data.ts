export const TRANSACTION_TYPE_LABEL: Record<string, string> = {
  INCOME: "Entrada",
  EXPENSE: "Saída",
};

export const categories = [
  { label: "Alimentação", value: "Alimentação" },
  { label: "Transporte", value: "Transporte" },
  { label: "Mercado", value: "Mercado" },
  { label: "Investimento", value: "Investimento" },
  { label: "Utilidades", value: "Utilidades" },
  { label: "Salário", value: "Salário" },
  { label: "Entretenimento", value: "Entretenimento" },
] as const;
