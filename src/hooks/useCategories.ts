import type { CategoryDetail } from "@/types/dashboard";

const MOCK_CATEGORIES: CategoryDetail[] = [
  {
    id: "1",
    name: "Alimentação",
    description: "Restaurantes, delivery e refeições",
    color: "blue",
    icon: "utensils",
    itemCount: 12,
  },
  {
    id: "2",
    name: "Entretenimento",
    description: "Cinema, jogos e lazer",
    color: "pink",
    icon: "ticket",
    itemCount: 2,
  },
  {
    id: "3",
    name: "Investimento",
    description: "Aplicações e retornos financeiros",
    color: "green",
    icon: "piggy-bank",
    itemCount: 1,
  },
  {
    id: "4",
    name: "Mercado",
    description: "Compras de supermercado e mantimentos",
    color: "orange",
    icon: "shopping-cart",
    itemCount: 3,
  },
  {
    id: "5",
    name: "Salário",
    description: "Renda mensal e bonificações",
    color: "green",
    icon: "briefcase-business",
    itemCount: 3,
  },
  {
    id: "6",
    name: "Saúde",
    description: "Medicamentos, consultas e exames",
    color: "red",
    icon: "heart-pulse",
    itemCount: 0,
  },
  {
    id: "7",
    name: "Transporte",
    description: "Gasolina, transporte público e viagens",
    color: "purple",
    icon: "car-front",
    itemCount: 8,
  },
  {
    id: "8",
    name: "Utilidades",
    description: "Energia, água, internet e telefone",
    color: "yellow",
    icon: "wrench",
    itemCount: 7,
  },
];

type CategoryStats = {
  totalCategories: number;
  totalItems: number;
  mostUsedCategory: CategoryDetail;
};

type UseCategoriesResult = {
  categories: CategoryDetail[];
  stats: CategoryStats;
  isLoading: boolean;
  error: Error | null;
};

export function useCategories(): UseCategoriesResult {
  const totalItems = MOCK_CATEGORIES.reduce(
    (sum, cat) => sum + cat.itemCount,
    0,
  );

  const mostUsed = MOCK_CATEGORIES.reduce((prev, current) =>
    prev.itemCount > current.itemCount ? prev : current,
  );

  return {
    categories: MOCK_CATEGORIES,
    stats: {
      totalCategories: MOCK_CATEGORIES.length,
      totalItems,
      mostUsedCategory: mostUsed,
    },
    isLoading: false,
    error: null,
  };
}
