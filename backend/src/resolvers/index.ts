import * as categoryService from "@/services/category.js";
import * as userService from "@/services/user.js";
import * as transactionService from "@/services/transaction.js";
import type { GraphQLContext } from "@/types/index.js";
import type {
  CreateCategoryInput,
  CreateTransactionInput,
  CreateUserInput,
  UpdateTransactionInput,
} from "@/types/graphql.js";

export const resolvers = {
  Query: {
    users: () => userService.listUsers(),
    user: (_parent: unknown, { id }: { id: string }) => userService.getUserById(id),
    userByEmail: (_parent: unknown, { email }: { email: string }) =>
      userService.getUserByEmail(email),
    transactions: (_parent: unknown, { userId }: { userId?: string }) =>
      transactionService.listTransactions(userId ?? undefined),
    transaction: (_parent: unknown, { id }: { id: string }) =>
      transactionService.getTransactionById(id),
    categories: () => categoryService.listCategories(),
    category: (_parent: unknown, { id }: { id: string }) => categoryService.getCategoryById(id),
  },

  Mutation: {
    createUser: (_parent: unknown, { input }: { input: CreateUserInput }) =>
      userService.createUser(input),
    createTransaction: (_parent: unknown, { input }: { input: CreateTransactionInput }) =>
      transactionService.createTransaction(input),
    updateTransaction: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateTransactionInput },
    ) => transactionService.updateTransaction(id, input),
    deleteTransaction: (_parent: unknown, { id }: { id: string }) =>
      transactionService.deleteTransaction(id),
    createCategory: (_parent: unknown, { input }: { input: CreateCategoryInput }) =>
      categoryService.createCategory(input),
  },

  User: {
    transactions: (parent: { id: string }) => transactionService.listTransactions(parent.id),
  },

  Transaction: {
    user: (parent: { userId: string }, _args: unknown, ctx: GraphQLContext) =>
      ctx.loaders.user.load(parent.userId),
  },
} as const;
