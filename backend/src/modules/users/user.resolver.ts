import * as transactionService from "@/modules/transactions/transaction.service.js";
import * as userService from "@/modules/users/user.service.js";
import { assertSameUser } from "@/modules/shared/authorization.js";
import {
  Authenticated,
  getAuthenticatedUserId,
} from "@/modules/shared/middlewares/authentication.js";
import { UpdateUserInput } from "@/modules/users/user.types.js";
import { TransactionModel, UserModel } from "@/schema/models.js";
import type { GraphQLContext } from "@/types/index.js";
import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from "type-graphql";

@Resolver(() => UserModel)
export class UserResolver {
  @Query(() => UserModel, { nullable: true })
  @Authenticated()
  user(@Arg("id", () => ID) id: string, @Ctx() context: GraphQLContext) {
    return userService.getUserById(id, getAuthenticatedUserId(context));
  }

  @Mutation(() => UserModel)
  @Authenticated()
  updateUser(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateUserInput) input: UpdateUserInput,
    @Ctx() context: GraphQLContext,
  ) {
    return userService.updateUser(id, input, getAuthenticatedUserId(context));
  }

  @Mutation(() => ID)
  @Authenticated()
  deleteUser(@Arg("id", () => ID) id: string, @Ctx() context: GraphQLContext) {
    return userService.deleteUser(id, getAuthenticatedUserId(context));
  }

  @FieldResolver(() => [TransactionModel])
  @Authenticated()
  transactions(@Root() parent: UserModel, @Ctx() context: GraphQLContext) {
    const authenticatedUserId = getAuthenticatedUserId(context);

    assertSameUser(parent.id, authenticatedUserId);

    return transactionService.listTransactions({ userId: authenticatedUserId });
  }
}
