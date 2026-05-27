import { prisma } from "@/lib/prisma.js";
import { createCategorySchema, updateCategorySchema, validateOrThrow } from "@/lib/validation.js";
import { forbidden, notFound } from "@/modules/shared/errors.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/modules/categories/category.types.js";

export async function listCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategoryById(id: string, userId: string) {
  return prisma.category.findFirst({ where: { id, userId } });
}

export async function createCategory(input: CreateCategoryInput, userId: string) {
  const parsed = validateOrThrow(createCategorySchema, input);

  return prisma.category.create({
    data: {
      name: parsed.name,
      description: parsed.description ?? "",
      color: parsed.color,
      icon: parsed.icon,
      userId,
    },
  });
}

export async function updateCategory(id: string, input: UpdateCategoryInput, userId: string) {
  const parsed = validateOrThrow(updateCategorySchema, input);
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
      ...(parsed.name !== undefined && { name: parsed.name }),
      ...(parsed.description !== undefined && {
        description: parsed.description ?? "",
      }),
      ...(parsed.color !== undefined && { color: parsed.color }),
      ...(parsed.icon !== undefined && { icon: parsed.icon }),
    },
  });
}

export async function deleteCategory(id: string, userId: string) {
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
