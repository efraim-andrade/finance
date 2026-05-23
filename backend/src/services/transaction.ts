import { prisma } from "@/lib/prisma.js";
import type { CreateTransactionInput } from "@/types/graphql.js";

export async function listTransactions(userId?: string) {
  const where = userId ? { userId } : {};

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
  return prisma.transaction.create({
    data: {
      description: input.description,
      amount: input.amount,
      type: input.type,
      category: input.category,
      date: new Date(input.date),
      userId: input.userId,
    },
    include: { user: true },
  });
}
