import { prisma } from "@/lib/prisma.js";
import type { CreateCategoryInput } from "@/types/graphql.js";

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
