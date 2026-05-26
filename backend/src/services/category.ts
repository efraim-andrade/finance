import { prisma } from "@/lib/prisma.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/types/graphql.js";

function requireAuthenticatedUserId(userId?: string): string {
  if (!userId) {
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }

  return userId;
}

export async function listCategories(userId?: string) {
  if (!userId) {
    return [];
  }

  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategoryById(id: string, userId?: string) {
  if (!userId) {
    return null;
  }

  return prisma.category.findFirst({
    where: { id, userId },
  });
}

export async function createCategory(input: CreateCategoryInput, userId?: string) {
  const authenticatedUserId = requireAuthenticatedUserId(userId);

  const user = await prisma.user.findUnique({ where: { id: authenticatedUserId } });

  if (!user) {
    throw new Error(
      `Usuário com ID "${authenticatedUserId}" não encontrado. Faça login novamente.`,
    );
  }

  return prisma.category.create({
    data: {
      name: input.name,
      description: input.description ?? "",
      color: input.color,
      icon: input.icon,
      userId: authenticatedUserId,
    },
  });
}

export async function updateCategory(id: string, input: UpdateCategoryInput, userId?: string) {
  const authenticatedUserId = requireAuthenticatedUserId(userId);

  const existing = await prisma.category.findFirst({ where: { id, userId: authenticatedUserId } });

  if (!existing) {
    throw new Error("Categoria não encontrada");
  }

  return prisma.category.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && {
        description: input.description ?? "",
      }),
      ...(input.color !== undefined && { color: input.color }),
      ...(input.icon !== undefined && { icon: input.icon }),
    },
  });
}

export async function deleteCategory(id: string, userId?: string) {
  const authenticatedUserId = requireAuthenticatedUserId(userId);

  const existing = await prisma.category.findFirst({ where: { id, userId: authenticatedUserId } });

  if (!existing) {
    throw new Error("Categoria não encontrada");
  }

  await prisma.category.delete({
    where: { id },
  });

  return id;
}
