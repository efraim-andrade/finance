import { prisma } from "@/lib/prisma.js";
import { assertAuthenticatedUserId } from "@/modules/shared/authorization.js";
import { forbidden, notFound } from "@/modules/shared/errors.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/modules/categories/category.types.js";

export async function listCategories(authenticatedUserId: string) {
  const userId = assertAuthenticatedUserId(authenticatedUserId);

  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategoryById(id: string, authenticatedUserId: string) {
  const userId = assertAuthenticatedUserId(authenticatedUserId);

  return prisma.category.findFirst({ where: { id, userId } });
}

export async function createCategory(input: CreateCategoryInput, authenticatedUserId: string) {
  const userId = assertAuthenticatedUserId(authenticatedUserId);

  return prisma.category.create({
    data: {
      name: input.name,
      description: input.description ?? "",
      color: input.color,
      icon: input.icon,
      userId,
    },
  });
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
  authenticatedUserId: string,
) {
  const userId = assertAuthenticatedUserId(authenticatedUserId);
  const existing = await prisma.category.findUnique({ where: { id } });

  if (!existing) {
    throw notFound("Categoria não encontrada");
  }

  if (existing.userId !== userId) {
    throw forbidden();
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

export async function deleteCategory(id: string, authenticatedUserId: string) {
  const userId = assertAuthenticatedUserId(authenticatedUserId);
  const existing = await prisma.category.findUnique({ where: { id } });

  if (!existing) {
    throw notFound("Categoria não encontrada");
  }

  if (existing.userId !== userId) {
    throw forbidden();
  }

  await prisma.category.delete({ where: { id } });

  return id;
}
