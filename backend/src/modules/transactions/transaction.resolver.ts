import * as transactionService from "@/modules/transactions/transaction.service.js";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@/modules/transactions/transaction.types.js";
import { assertSameUser } from "@/modules/shared/authorization.js";
import {
  Authenticated,
  getAuthenticatedUserId,
} from "@/modules/shared/middlewares/authentication.js";
import {
  TransactionModel,
  TransactionsConnection,
  TransactionPeriodModel,
  UserModel,
} from "@/schema/models.js";
import type { GraphQLContext } from "@/types/index.js";
import { TransactionType } from "@prisma/client";
import { Arg, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root } from "type-graphql";

@Resolver(() => TransactionModel)
export class TransactionResolver {
  @Query(() => TransactionsConnection)
  @Authenticated()
  async transactions(
    @Ctx() context: GraphQLContext,
    @Arg("month", () => String, { nullable: true }) month?: string,
    @Arg("year", () => String, { nullable: true }) year?: string,
    @Arg("skip", () => Int, { nullable: true }) skip?: number,
    @Arg("take", () => Int, { nullable: true }) take?: number,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("search", () => String, { nullable: true }) search?: string,
    @Arg("type", () => TransactionType, { nullable: true }) type?: TransactionType,
    @Arg("category", () => String, { nullable: true }) category?: string,
  ) {
    const userId = getAuthenticatedUserId(context);
    const filters = { userId, month, year, skip, take, limit, search, type, category };

    const nodes = await transactionService.listTransactions(filters);
    const totalCount = await transactionService.countTransactions(filters);

    return { nodes, totalCount };
  }

  @Query(() => TransactionModel, { nullable: true })
  @Authenticated()
  transaction(@Arg("id", () => ID) id: string, @Ctx() context: GraphQLContext) {
    return transactionService.getTransactionById(id, getAuthenticatedUserId(context));
  }

  @Query(() => [TransactionPeriodModel])
  @Authenticated()
  transactionPeriods(@Ctx() context: GraphQLContext) {
    return transactionService.listTransactionPeriods(getAuthenticatedUserId(context));
  }

  @Mutation(() => TransactionModel)
  @Authenticated()
  createTransaction(
    @Arg("input", () => CreateTransactionInput) input: CreateTransactionInput,
    @Ctx() context: GraphQLContext,
  ) {
    return transactionService.createTransaction(input, getAuthenticatedUserId(context));
  }

  @Mutation(() => TransactionModel)
  @Authenticated()
  updateTransaction(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateTransactionInput) input: UpdateTransactionInput,
    @Ctx() context: GraphQLContext,
  ) {
    return transactionService.updateTransaction(id, input, getAuthenticatedUserId(context));
  }

  @Mutation(() => ID)
  @Authenticated()
  deleteTransaction(@Arg("id", () => ID) id: string, @Ctx() context: GraphQLContext) {
    return transactionService.deleteTransaction(id, getAuthenticatedUserId(context));
  }

  @Mutation(() => Int)
  @Authenticated()
  deleteExampleTransactions(@Ctx() context: GraphQLContext) {
    return transactionService.deleteExampleTransactions(getAuthenticatedUserId(context));
  }

  @FieldResolver(() => UserModel)
  @Authenticated()
  user(@Root() parent: { userId: string }, @Ctx() context: GraphQLContext) {
    assertSameUser(parent.userId, getAuthenticatedUserId(context));

    return context.loaders.user.load(parent.userId);
  }
}
