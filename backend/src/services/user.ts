import { prisma } from "@/lib/prisma.js";
import type { CreateUserInput } from "@/types/graphql.js";

export async function listUsers() {
  return prisma.user.findMany({
    include: { transactions: true },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { transactions: true },
  });
}

export async function createUser(input: CreateUserInput) {
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: input.password, // TODO: hash with bcrypt
    },
    include: { transactions: true },
  });
}
