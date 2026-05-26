import * as categoryService from "@/modules/categories/category.service.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/modules/categories/category.types.js";
import type { GraphQLContext } from "@/types/index.js";

export const categoryResolvers = {
  Query: {
    categories: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
      categoryService.listCategories(context.userId),
    category: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) =>
      categoryService.getCategoryById(id, context.userId),
  },
  Mutation: {
    createCategory: (
      _parent: unknown,
      { input }: { input: CreateCategoryInput },
      context: GraphQLContext,
    ) => categoryService.createCategory(input, context.userId),
    updateCategory: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateCategoryInput },
      context: GraphQLContext,
    ) => categoryService.updateCategory(id, input, context.userId),
    deleteCategory: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) =>
      categoryService.deleteCategory(id, context.userId),
  },
} as const;
