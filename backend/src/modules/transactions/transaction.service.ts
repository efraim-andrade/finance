import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma.js";
import { assertAuthenticatedUserId } from "@/modules/shared/authorization.js";
import { badUserInput, forbidden, notFound, unauthenticated } from "@/modules/shared/errors.js";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@/modules/transactions/transaction.types.js";

type TransactionFilters = {
  userId: string;
  month?: string | null;
  year?: string | null;
};

const MIN_MONTH = 1;
const MAX_MONTH = 12;

function parseTransactionDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw badUserInput("Data da transação inválida");
  }

  return date;
}

function parseTransactionPeriod(filters: TransactionFilters) {
  if (!filters.month && !filters.year) {
    return null;
  }

  if (!filters.month || !filters.year) {
    throw badUserInput("Mês e ano devem ser informados juntos");
  }

  const year = Number.parseInt(filters.year, 10);
  const month = Number.parseInt(filters.month, 10);

  if (Number.isNaN(year) || Number.isNaN(month) || month < MIN_MONTH || month > MAX_MONTH) {
    throw badUserInput("Período de transação inválido");
  }

  return { month: month - 1, year };
}

function buildTransactionFilters(filters: TransactionFilters): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = { userId: filters.userId };
  const period = parseTransactionPeriod(filters);

  if (period) {
    where.date = {
      gte: new Date(Date.UTC(period.year, period.month, 1)),
      lt: new Date(Date.UTC(period.year, period.month + 1, 1)),
    };
  }

  return where;
}

export async function listTransactions(filters: TransactionFilters) {
  const userId = assertAuthenticatedUserId(filters.userId);

  return prisma.transaction.findMany({
    where: buildTransactionFilters({ ...filters, userId }),
    orderBy: { date: "desc" },
  });
}

export async function getTransactionById(id: string, authenticatedUserId: string) {
  const userId = assertAuthenticatedUserId(authenticatedUserId);

  return prisma.transaction.findFirst({ where: { id, userId } });
}

export async function createTransaction(
  input: CreateTransactionInput,
  authenticatedUserId: string,
) {
  const userId = assertAuthenticatedUserId(authenticatedUserId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw unauthenticated("Sessão inválida ou expirada. Faça login novamente.");
  }

  return prisma.transaction.create({
    data: {
      description: input.description,
      amount: input.amount,
      type: input.type,
      category: input.category,
      date: parseTransactionDate(input.date),
      userId,
      isExample: false,
    },
  });
}

export async function updateTransaction(
  id: string,
  input: UpdateTransactionInput,
  authenticatedUserId: string,
) {
  const userId = assertAuthenticatedUserId(authenticatedUserId);
  const existing = await prisma.transaction.findUnique({ where: { id } });

  if (!existing) {
    throw notFound("Transação não encontrada");
  }

  if (existing.userId !== userId) {
    throw forbidden();
  }

  const data: Prisma.TransactionUpdateInput = {};

  if (input.description !== undefined) data.description = input.description;
  if (input.amount !== undefined) data.amount = input.amount;
  if (input.type !== undefined) data.type = input.type;
  if (input.category !== undefined) data.category = input.category;
  if (input.date !== undefined) data.date = parseTransactionDate(input.date);

  return prisma.transaction.update({
    where: { id },
    data,
  });
}

export async function deleteTransaction(id: string, authenticatedUserId: string): Promise<string> {
  const userId = assertAuthenticatedUserId(authenticatedUserId);
  const existing = await prisma.transaction.findUnique({ where: { id } });

  if (!existing) {
    throw notFound("Transação não encontrada");
  }

  if (existing.userId !== userId) {
    throw forbidden();
  }

  await prisma.transaction.delete({ where: { id } });

  return id;
}

export async function listTransactionPeriods(authenticatedUserId: string) {
  const userId = assertAuthenticatedUserId(authenticatedUserId);
  const transactions = await prisma.transaction.findMany({
    where: { userId },
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

export async function deleteExampleTransactions(authenticatedUserId: string): Promise<number> {
  const userId = assertAuthenticatedUserId(authenticatedUserId);
  const result = await prisma.transaction.deleteMany({
    where: { userId, isExample: true },
  });

  return result.count;
}
