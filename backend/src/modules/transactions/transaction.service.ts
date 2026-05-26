import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma.js";
import { requireAuthenticatedUserId } from "@/modules/shared/authorization.js";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@/modules/transactions/transaction.types.js";

type TransactionFilters = {
  userId?: string;
  month?: string | null;
  year?: string | null;
};

function buildTransactionFilters(filters: TransactionFilters): Prisma.TransactionWhereInput {
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

  return where;
}

export async function listTransactions(filters: TransactionFilters = {}) {
  return prisma.transaction.findMany({
    where: buildTransactionFilters(filters),
    orderBy: { date: "desc" },
  });
}

export async function getTransactionById(id: string, userId?: string) {
  if (!userId) {
    return prisma.transaction.findUnique({ where: { id } });
  }

  return prisma.transaction.findFirst({ where: { id, userId } });
}

export async function createTransaction(input: CreateTransactionInput, userId?: string) {
  const authenticatedUserId = requireAuthenticatedUserId(userId);
  const ownerId = input.userId || authenticatedUserId;

  if (ownerId !== authenticatedUserId) {
    throw new Error("Não autorizado");
  }

  const user = await prisma.user.findUnique({
    where: { id: authenticatedUserId },
  });

  if (!user) {
    throw new Error(
      `Usuário com ID "${authenticatedUserId}" não encontrado. Faça login novamente.`,
    );
  }

  return prisma.transaction.create({
    data: {
      description: input.description,
      amount: input.amount,
      type: input.type,
      category: input.category,
      date: new Date(input.date),
      userId: authenticatedUserId,
      isExample: input.isExample ?? false,
    },
  });
}

export async function updateTransaction(
  id: string,
  input: UpdateTransactionInput,
  userId?: string,
) {
  const authenticatedUserId = requireAuthenticatedUserId(userId);
  const existing = await prisma.transaction.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Transação não encontrada");
  }

  if (existing.userId !== authenticatedUserId) {
    throw new Error("Não autorizado");
  }

  const data: Prisma.TransactionUpdateInput = {};

  if (input.description !== undefined) data.description = input.description;
  if (input.amount !== undefined) data.amount = input.amount;
  if (input.type !== undefined) data.type = input.type;
  if (input.category !== undefined) data.category = input.category;
  if (input.date !== undefined) data.date = new Date(input.date);

  return prisma.transaction.update({
    where: { id },
    data,
  });
}

export async function deleteTransaction(id: string, userId?: string): Promise<string> {
  const authenticatedUserId = requireAuthenticatedUserId(userId);
  const existing = await prisma.transaction.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Transação não encontrada");
  }

  if (existing.userId !== authenticatedUserId) {
    throw new Error("Não autorizado");
  }

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

export async function deleteExampleTransactions(userId?: string): Promise<number> {
  const authenticatedUserId = requireAuthenticatedUserId(userId);
  const result = await prisma.transaction.deleteMany({
    where: { userId: authenticatedUserId, isExample: true },
  });

  return result.count;
}
