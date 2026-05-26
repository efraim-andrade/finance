import { prisma } from "@/lib/prisma.js";
import { assertSameUser, requireAuthenticatedUserId } from "@/modules/shared/authorization.js";
import type { UpdateUserInput } from "@/modules/users/user.types.js";

export async function listUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function updateUser(id: string, input: UpdateUserInput, userId?: string) {
  const authenticatedUserId = requireAuthenticatedUserId(userId);

  assertSameUser(id, authenticatedUserId);

  return prisma.user.update({ where: { id }, data: input });
}

export async function deleteUser(id: string, userId?: string) {
  const authenticatedUserId = requireAuthenticatedUserId(userId);

  assertSameUser(id, authenticatedUserId);

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  await prisma.transaction.deleteMany({ where: { userId: id } });
  await prisma.category.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  return id;
}
