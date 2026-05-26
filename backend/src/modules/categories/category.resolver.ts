import * as categoryService from "@/modules/categories/category.service.js";
import { CreateCategoryInput, UpdateCategoryInput } from "@/modules/categories/category.types.js";
import { CategoryModel } from "@/schema/models.js";
import type { GraphQLContext } from "@/types/index.js";
import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";

@Resolver(() => CategoryModel)
export class CategoryResolver {
  @Query(() => [CategoryModel])
  categories(@Ctx() context: GraphQLContext) {
    return categoryService.listCategories(context.userId);
  }

  @Query(() => CategoryModel, { nullable: true })
  category(@Arg("id", () => ID) id: string, @Ctx() context: GraphQLContext) {
    return categoryService.getCategoryById(id, context.userId);
  }

  @Mutation(() => CategoryModel)
  createCategory(
    @Arg("input", () => CreateCategoryInput) input: CreateCategoryInput,
    @Ctx() context: GraphQLContext,
  ) {
    return categoryService.createCategory(input, context.userId);
  }

  @Mutation(() => CategoryModel)
  updateCategory(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateCategoryInput) input: UpdateCategoryInput,
    @Ctx() context: GraphQLContext,
  ) {
    return categoryService.updateCategory(id, input, context.userId);
  }

  @Mutation(() => ID)
  deleteCategory(@Arg("id", () => ID) id: string, @Ctx() context: GraphQLContext) {
    return categoryService.deleteCategory(id, context.userId);
  }
}
