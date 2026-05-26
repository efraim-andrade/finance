import { prisma } from "@/lib/prisma.js";
import { assertAuthenticatedUserId, assertSameUser } from "@/modules/shared/authorization.js";
import { notFound } from "@/modules/shared/errors.js";
import type { UpdateUserInput } from "@/modules/users/user.types.js";

export async function listUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id: string, authenticatedUserId: string) {
  const userId = assertAuthenticatedUserId(authenticatedUserId);

  assertSameUser(id, userId);

  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function updateUser(id: string, input: UpdateUserInput, authenticatedUserId: string) {
  const userId = assertAuthenticatedUserId(authenticatedUserId);

  assertSameUser(id, userId);

  return prisma.user.update({ where: { id }, data: input });
}

export async function deleteUser(id: string, authenticatedUserId: string) {
  const userId = assertAuthenticatedUserId(authenticatedUserId);

  assertSameUser(id, userId);

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw notFound("Usuário não encontrado");
  }

  await prisma.$transaction([
    prisma.transaction.deleteMany({ where: { userId: id } }),
    prisma.category.deleteMany({ where: { userId: id } }),
    prisma.user.delete({ where: { id } }),
  ]);

  return id;
}
