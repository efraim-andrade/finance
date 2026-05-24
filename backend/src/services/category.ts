import { prisma } from "@/lib/prisma.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/types/graphql.js";

export async function listCategories(userId?: string) {
  const where = userId ? { OR: [{ userId: null }, { userId }] } : { userId: null };

  return prisma.category.findMany({
    where,
    orderBy: { name: "asc" },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
  });
}

export async function createCategory(input: CreateCategoryInput) {
  return prisma.category.create({
    data: {
      name: input.name,
      description: input.description ?? "",
      color: input.color,
      icon: input.icon,
      userId: input.userId ?? null,
    },
  });
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const existing = await prisma.category.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Categoria não encontrada");
  }

  if (!existing.userId) {
    throw new Error("Não é permitido editar categorias globais");
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

export async function deleteCategory(id: string) {
  const existing = await prisma.category.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Categoria não encontrada");
  }

  if (!existing.userId) {
    throw new Error("Não é permitido excluir categorias globais");
  }

  await prisma.category.delete({
    where: { id },
  });

  return id;
}
