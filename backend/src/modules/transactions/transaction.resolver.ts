import * as transactionService from "@/modules/transactions/transaction.service.js";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@/modules/transactions/transaction.types.js";
import type { GraphQLContext } from "@/types/index.js";

export const transactionResolvers = {
  Query: {
    transactions: (
      _parent: unknown,
      {
        month,
        year,
      }: {
        month?: string | null;
        year?: string | null;
      },
      context: GraphQLContext,
    ) => transactionService.listTransactions({ userId: context.userId, month, year }),
    transaction: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) =>
      transactionService.getTransactionById(id, context.userId),
    transactionPeriods: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
      transactionService.listTransactionPeriods(context.userId),
  },
  Mutation: {
    createTransaction: (
      _parent: unknown,
      { input }: { input: CreateTransactionInput },
      context: GraphQLContext,
    ) => transactionService.createTransaction(input, context.userId),
    updateTransaction: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateTransactionInput },
      context: GraphQLContext,
    ) => transactionService.updateTransaction(id, input, context.userId),
    deleteTransaction: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) =>
      transactionService.deleteTransaction(id, context.userId),
    deleteExampleTransactions: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
      transactionService.deleteExampleTransactions(context.userId),
  },
  Transaction: {
    user: (parent: { userId: string }, _args: unknown, context: GraphQLContext) =>
      context.loaders.user.load(parent.userId),
  },
} as const;
