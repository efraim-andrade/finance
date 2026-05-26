import type { Prisma, TransactionType } from "@prisma/client";

const DEFAULT_CATEGORIES = [
  { name: "Carro", description: "", color: "purple", icon: "car" },
  { name: "Entretenimento", description: "", color: "pink", icon: "ticket" },
  { name: "Investimentos", description: "", color: "green", icon: "receipt" },
  { name: "Mercado", description: "", color: "orange", icon: "cart" },
  { name: "Renda Fixa", description: "", color: "green", icon: "piggy" },
  { name: "Salário", description: "", color: "green", icon: "piggy" },
  { name: "Saúde", description: "", color: "red", icon: "dumbbell" },
  { name: "Utilidades", description: "", color: "yellow", icon: "wrench" },
] as const;

const EXAMPLE_TRANSACTIONS: {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
}[] = [
  { description: "Salário mensal", amount: 5000, type: "INCOME", category: "Salário" },
  { description: "Mercado mensal", amount: 650, type: "EXPENSE", category: "Mercado" },
  { description: "Gasolina", amount: 200, type: "EXPENSE", category: "Carro" },
  { description: "Farmácia", amount: 89.9, type: "EXPENSE", category: "Saúde" },
  { description: "Streaming", amount: 55.9, type: "EXPENSE", category: "Entretenimento" },
  { description: "Conta de luz", amount: 180, type: "EXPENSE", category: "Utilidades" },
  { description: "CDB", amount: 300, type: "INCOME", category: "Renda Fixa" },
  { description: "Ações", amount: 500, type: "INCOME", category: "Investimentos" },
];

function daysAgo(days: number): Date {
  const date = new Date();

  date.setDate(date.getDate() - days);

  return date;
}

async function seedDefaultCategories(transaction: Prisma.TransactionClient, userId: string) {
  await transaction.category.createMany({
    data: DEFAULT_CATEGORIES.map((category) => ({
      ...category,
      userId,
    })),
  });
}

async function seedExampleTransactions(transaction: Prisma.TransactionClient, userId: string) {
  await transaction.transaction.createMany({
    data: EXAMPLE_TRANSACTIONS.map((transactionItem, index) => ({
      description: transactionItem.description,
      amount: transactionItem.amount,
      type: transactionItem.type,
      category: transactionItem.category,
      date: daysAgo(index * 5),
      userId,
      isExample: true,
    })),
  });
}

export async function seedUserWorkspace(transaction: Prisma.TransactionClient, userId: string) {
  await seedDefaultCategories(transaction, userId);
  await seedExampleTransactions(transaction, userId);
}
