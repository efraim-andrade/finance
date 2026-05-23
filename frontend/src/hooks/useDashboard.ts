import type {
  CategorySummary,
  DashboardSummary,
  Transaction,
} from "@/types/dashboard";

const MOCK_SUMMARY: DashboardSummary = {
  totalBalance: 12847.32,
  monthlyIncome: 4250.0,
  monthlyExpense: 2180.45,
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    description: "Pagamento de Salário",
    amount: 4250.0,
    type: "INCOME",
    category: "Trabalho",
    categoryColor: "green",
    date: "01/12/25",
    tag: "Receita",
  },
  {
    id: "2",
    description: "Jantar no Restaurante",
    amount: 89.5,
    type: "EXPENSE",
    category: "Alimentação",
    categoryColor: "blue",
    date: "30/11/25",
    tag: "Alimentação",
  },
  {
    id: "3",
    description: "Posto de Gasolina",
    amount: 100.0,
    type: "EXPENSE",
    category: "Transporte",
    categoryColor: "purple",
    date: "29/11/25",
    tag: "Transporte",
  },
  {
    id: "4",
    description: "Compras no Mercado",
    amount: 156.8,
    type: "EXPENSE",
    category: "Mercado",
    categoryColor: "orange",
    date: "28/11/25",
    tag: "Mercado",
  },
  {
    id: "5",
    description: "Retorno de Investimento",
    amount: 340.25,
    type: "INCOME",
    category: "Investimento",
    categoryColor: "green",
    date: "26/11/25",
    tag: "Investimento",
  },
];

const MOCK_CATEGORIES: CategorySummary[] = [
  { id: "1", name: "Alimentação", color: "blue", itemCount: 12, total: 542.3 },
  { id: "2", name: "Transporte", color: "purple", itemCount: 8, total: 385.5 },
  { id: "3", name: "Mercado", color: "orange", itemCount: 3, total: 298.75 },
  {
    id: "4",
    name: "Entretenimento",
    color: "pink",
    itemCount: 2,
    total: 186.2,
  },
  { id: "5", name: "Utilidades", color: "yellow", itemCount: 7, total: 245.8 },
];

type UseDashboardResult = {
  summary: DashboardSummary;
  transactions: Transaction[];
  categories: CategorySummary[];
  isLoading: boolean;
};

export function useDashboard(): UseDashboardResult {
  return {
    summary: MOCK_SUMMARY,
    transactions: MOCK_TRANSACTIONS,
    categories: MOCK_CATEGORIES,
    isLoading: false,
  };
}
