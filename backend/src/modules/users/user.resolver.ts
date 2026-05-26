import * as transactionService from "@/modules/transactions/transaction.service.js";
import * as userService from "@/modules/users/user.service.js";
import { UpdateUserInput } from "@/modules/users/user.types.js";
import { TransactionModel, UserModel } from "@/schema/models.js";
import type { GraphQLContext } from "@/types/index.js";
import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from "type-graphql";

@Resolver(() => UserModel)
export class UserResolver {
  @Query(() => UserModel, { nullable: true })
  user(@Arg("id", () => ID) id: string, @Ctx() context: GraphQLContext) {
    return userService.getUserById(id, context.userId);
  }

  @Mutation(() => UserModel)
  updateUser(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateUserInput) input: UpdateUserInput,
    @Ctx() context: GraphQLContext,
  ) {
    return userService.updateUser(id, input, context.userId);
  }

  @Mutation(() => ID)
  deleteUser(@Arg("id", () => ID) id: string, @Ctx() context: GraphQLContext) {
    return userService.deleteUser(id, context.userId);
  }

  @FieldResolver(() => [TransactionModel])
  transactions(@Root() parent: UserModel) {
    return transactionService.listTransactions({ userId: parent.id });
  }
}
