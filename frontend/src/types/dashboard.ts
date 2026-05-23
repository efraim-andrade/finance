export type TransactionType = "INCOME" | "EXPENSE";

export type CategoryColor =
  | "gray"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  categoryColor: CategoryColor;
  date: string;
  tag: string;
};

export type CategorySummary = {
  id: string;
  name: string;
  color: CategoryColor;
  itemCount: number;
  total: number;
};

export type CategoryDetail = {
  id: string;
  name: string;
  description: string;
  color: CategoryColor;
  icon: string;
  itemCount: number;
};

export type DashboardSummary = {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
};
