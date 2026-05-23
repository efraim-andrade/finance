import { prisma } from "@/lib/prisma.js";
import type { CreateTransactionInput, UpdateTransactionInput } from "@/types/graphql.js";

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
