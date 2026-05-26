import { prisma } from "@/lib/prisma.js";
import { requireAuthenticatedUserId } from "@/modules/shared/authorization.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/modules/categories/category.types.js";

export async function listCategories(userId?: string) {
  const where = userId ? { OR: [{ userId: null }, { userId }] } : { userId: null };

  return prisma.category.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategoryById(id: string, userId?: string) {
  const where = userId ? { id, OR: [{ userId: null }, { userId }] } : { id, userId: null };

  return prisma.category.findFirst({ where });
}

export async function createCategory(input: CreateCategoryInput, userId?: string) {
  const authenticatedUserId = requireAuthenticatedUserId(userId);

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
  const existing = await prisma.category.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Categoria não encontrada");
  }

  if (!existing.userId) {
    throw new Error("Não é permitido editar categorias globais");
  }

  if (existing.userId !== authenticatedUserId) {
    throw new Error("Não autorizado");
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
  const existing = await prisma.category.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Categoria não encontrada");
  }

  if (!existing.userId) {
    throw new Error("Não é permitido excluir categorias globais");
  }

  if (existing.userId !== authenticatedUserId) {
    throw new Error("Não autorizado");
  }

  await prisma.category.delete({ where: { id } });

  return id;
}
