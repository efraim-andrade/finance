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

export async function deleteExampleTransactions(userId: string): Promise<number> {
  const result = await prisma.transaction.deleteMany({
    where: { userId, isExample: true },
  });

  return result.count;
}
