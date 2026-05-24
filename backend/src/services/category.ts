import { prisma } from "@/lib/prisma.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/types/graphql.js";

export async function listCategories() {
  return prisma.category.findMany({
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
    },
  });
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
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
  await prisma.category.delete({
    where: { id },
  });

  return id;
}
