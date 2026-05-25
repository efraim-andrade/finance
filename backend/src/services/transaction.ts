import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma.js";
import type { CreateTransactionInput, UpdateTransactionInput } from "@/types/graphql.js";

type TransactionFilters = {
  userId?: string;
  month?: string | null;
  year?: string | null;
};

export async function listTransactions(filters: TransactionFilters = {}) {
  const where: Prisma.TransactionWhereInput = {};

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.month && filters.year) {
    const year = Number.parseInt(filters.year, 10);
    const month = Number.parseInt(filters.month, 10) - 1;

    if (!Number.isNaN(year) && !Number.isNaN(month)) {
      where.date = {
        gte: new Date(Date.UTC(year, month, 1)),
        lt: new Date(Date.UTC(year, month + 1, 1)),
      };
    }
  }

  return prisma.transaction.findMany({
    where,
    include: { user: true },
    orderBy: { date: "desc" },
  });
}

export async function getTransactionById(id: string) {
  return prisma.transaction.findUnique({
    where: { id },
    include: { user: true },
  });
}

export async function createTransaction(input: CreateTransactionInput) {
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
  });

  if (!user) {
    throw new Error(`Usuário com ID "${input.userId}" não encontrado. Faça login novamente.`);
  }

  return prisma.transaction.create({
    data: {
      description: input.description,
      amount: input.amount,
      type: input.type,
      category: input.category,
      date: new Date(input.date),
      userId: input.userId,
      isExample: input.isExample ?? false,
    },
    include: { user: true },
  });
}

export async function updateTransaction(id: string, input: UpdateTransactionInput) {
  const data: Record<string, unknown> = { ...input };

  if (input.date) {
    data.date = new Date(input.date);
  }

  return prisma.transaction.update({
    where: { id },
    data,
    include: { user: true },
  });
}

export async function deleteTransaction(id: string): Promise<string> {
  await prisma.transaction.delete({ where: { id } });

  return id;
}

export async function listTransactionPeriods(userId?: string) {
  const where = userId ? { userId } : {};

  const transactions = await prisma.transaction.findMany({
    where,
    select: { date: true },
    orderBy: { date: "desc" },
    take: 1200,
  });

  const seen = new Set<string>();
  const periods: { month: string; year: string }[] = [];

  for (const { date } of transactions) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    const key = `${year}-${month}`;

    if (!seen.has(key)) {
      seen.add(key);
      periods.push({ month, year });
    }
  }

  return periods;
}

export async function deleteExampleTransactions(userId: string): Promise<number> {
  const result = await prisma.transaction.deleteMany({
    where: { userId, isExample: true },
  });

  return result.count;
}
