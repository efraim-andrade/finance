import * as categoryService from "@/modules/categories/category.service.js";
import { CreateCategoryInput, UpdateCategoryInput } from "@/modules/categories/category.types.js";
import {
  Authenticated,
  getAuthenticatedUserId,
} from "@/modules/shared/middlewares/authentication.js";
import { CategoryModel } from "@/schema/models.js";
import type { GraphQLContext } from "@/types/index.js";
import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";

@Resolver(() => CategoryModel)
export class CategoryResolver {
  @Query(() => [CategoryModel])
  @Authenticated()
  categories(@Ctx() context: GraphQLContext) {
    return categoryService.listCategories(getAuthenticatedUserId(context));
  }

  @Query(() => CategoryModel, { nullable: true })
  @Authenticated()
  category(@Arg("id", () => ID) id: string, @Ctx() context: GraphQLContext) {
    return categoryService.getCategoryById(id, getAuthenticatedUserId(context));
  }

  @Mutation(() => CategoryModel)
  @Authenticated()
  createCategory(
    @Arg("input", () => CreateCategoryInput) input: CreateCategoryInput,
    @Ctx() context: GraphQLContext,
  ) {
    return categoryService.createCategory(input, getAuthenticatedUserId(context));
  }

  @Mutation(() => CategoryModel)
  @Authenticated()
  updateCategory(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateCategoryInput) input: UpdateCategoryInput,
    @Ctx() context: GraphQLContext,
  ) {
    return categoryService.updateCategory(id, input, getAuthenticatedUserId(context));
  }

  @Mutation(() => ID)
  @Authenticated()
  deleteCategory(@Arg("id", () => ID) id: string, @Ctx() context: GraphQLContext) {
    return categoryService.deleteCategory(id, getAuthenticatedUserId(context));
  }
}
