import * as userService from "@/services/user.js";
import * as transactionService from "@/services/transaction.js";
import type { GraphQLContext } from "@/types/index.js";
import type { CreateUserInput, CreateTransactionInput } from "@/types/graphql.js";

export const resolvers = {
  Query: {
    users: () => userService.listUsers(),
    user: (_parent: unknown, { id }: { id: string }) => userService.getUserById(id),
    transactions: (_parent: unknown, { userId }: { userId?: string }) =>
      transactionService.listTransactions(userId ?? undefined),
    transaction: (_parent: unknown, { id }: { id: string }) =>
      transactionService.getTransactionById(id),
  },

  Mutation: {
    createUser: (_parent: unknown, { input }: { input: CreateUserInput }) =>
      userService.createUser(input),
    createTransaction: (_parent: unknown, { input }: { input: CreateTransactionInput }) =>
      transactionService.createTransaction(input),
  },

  User: {
    transactions: (parent: { id: string }) => transactionService.listTransactions(parent.id),
  },

  Transaction: {
    user: (parent: { userId: string }, _args: unknown, ctx: GraphQLContext) =>
      ctx.loaders.user.load(parent.userId),
  },
} as const;
