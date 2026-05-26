import * as transactionService from "@/modules/transactions/transaction.service.js";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@/modules/transactions/transaction.types.js";
import { TransactionModel, TransactionPeriodModel, UserModel } from "@/schema/models.js";
import type { GraphQLContext } from "@/types/index.js";
import { Arg, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root } from "type-graphql";

@Resolver(() => TransactionModel)
export class TransactionResolver {
  @Query(() => [TransactionModel])
  transactions(
    @Ctx() context: GraphQLContext,
    @Arg("month", () => String, { nullable: true }) month?: string,
    @Arg("year", () => String, { nullable: true }) year?: string,
  ) {
    return transactionService.listTransactions({ userId: context.userId, month, year });
  }

  @Query(() => TransactionModel, { nullable: true })
  transaction(@Arg("id", () => ID) id: string, @Ctx() context: GraphQLContext) {
    return transactionService.getTransactionById(id, context.userId);
  }

  @Query(() => [TransactionPeriodModel])
  transactionPeriods(@Ctx() context: GraphQLContext) {
    return transactionService.listTransactionPeriods(context.userId);
  }

  @Mutation(() => TransactionModel)
  createTransaction(
    @Arg("input", () => CreateTransactionInput) input: CreateTransactionInput,
    @Ctx() context: GraphQLContext,
  ) {
    return transactionService.createTransaction(input, context.userId);
  }

  @Mutation(() => TransactionModel)
  updateTransaction(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateTransactionInput) input: UpdateTransactionInput,
    @Ctx() context: GraphQLContext,
  ) {
    return transactionService.updateTransaction(id, input, context.userId);
  }

  @Mutation(() => ID)
  deleteTransaction(@Arg("id", () => ID) id: string, @Ctx() context: GraphQLContext) {
    return transactionService.deleteTransaction(id, context.userId);
  }

  @Mutation(() => Int)
  deleteExampleTransactions(@Ctx() context: GraphQLContext) {
    return transactionService.deleteExampleTransactions(context.userId);
  }

  @FieldResolver(() => UserModel)
  user(@Root() parent: { userId: string }, @Ctx() context: GraphQLContext) {
    return context.loaders.user.load(parent.userId);
  }
}
