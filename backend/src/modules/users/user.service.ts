import { prisma } from "@/lib/prisma.js";
import { updateUserSchema, validateOrThrow } from "@/lib/validation.js";
import { assertSameUser } from "@/modules/shared/authorization.js";
import { notFound } from "@/modules/shared/errors.js";
import type { UpdateUserInput } from "@/modules/users/user.types.js";

export async function listUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id: string, userId: string) {
  assertSameUser(id, userId);

  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function updateUser(id: string, input: UpdateUserInput, userId: string) {
  const parsed = validateOrThrow(updateUserSchema, input);

  assertSameUser(id, userId);

  return prisma.user.update({ where: { id }, data: parsed });
}

export async function deleteUser(id: string, userId: string) {
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
