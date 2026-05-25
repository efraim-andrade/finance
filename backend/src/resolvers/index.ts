import * as categoryService from "@/services/category.js";
import * as transactionService from "@/services/transaction.js";
import * as userService from "@/services/user.js";
import type {
  CreateCategoryInput,
  CreateTransactionInput,
  CreateUserInput,
  LoginInput,
  RequestPasswordResetInput,
  ResetPasswordInput,
  UpdateCategoryInput,
  UpdateTransactionInput,
  UpdateUserInput,
} from "@/types/graphql.js";
import type { GraphQLContext } from "@/types/index.js";

export const resolvers = {
  Query: {
    users: () => userService.listUsers(),
    user: (_parent: unknown, { id }: { id: string }) => userService.getUserById(id),
    userByEmail: (_parent: unknown, { email }: { email: string }) =>
      userService.getUserByEmail(email),
    transactions: (
      _parent: unknown,
      {
        userId,
        month,
        year,
      }: {
        userId?: string;
        month?: string | null;
        year?: string | null;
      },
    ) => transactionService.listTransactions({ userId: userId ?? undefined, month, year }),
    transaction: (_parent: unknown, { id }: { id: string }) =>
      transactionService.getTransactionById(id),
    categories: (_parent: unknown, { userId }: { userId?: string }) =>
      categoryService.listCategories(userId ?? undefined),
    category: (_parent: unknown, { id }: { id: string }) => categoryService.getCategoryById(id),
    transactionPeriods: (_parent: unknown, { userId }: { userId?: string }) =>
      transactionService.listTransactionPeriods(userId ?? undefined),
  },

  Mutation: {
    createUser: (_parent: unknown, { input }: { input: CreateUserInput }) =>
      userService.createUser(input),
    login: (_parent: unknown, { input }: { input: LoginInput }) =>
      userService.loginUser(input.email, input.password),
    updateUser: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateUserInput },
      ctx: GraphQLContext,
    ) => userService.updateUser(id, input, ctx.userId),
    deleteUser: (
      _parent: unknown,
      { id }: { id: string },
      ctx: GraphQLContext,
    ) => userService.deleteUser(id, ctx.userId),
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
    updateCategory: (_parent: unknown, { id, input }: { id: string; input: UpdateCategoryInput }) =>
      categoryService.updateCategory(id, input),
    deleteCategory: (_parent: unknown, { id }: { id: string }) =>
      categoryService.deleteCategory(id),
    deleteExampleTransactions: (_parent: unknown, { userId }: { userId: string }) =>
      transactionService.deleteExampleTransactions(userId),
    requestPasswordReset: (_parent: unknown, { input }: { input: RequestPasswordResetInput }) =>
      userService.requestPasswordReset(input.email),
    resetPassword: (_parent: unknown, { input }: { input: ResetPasswordInput }) =>
      userService.resetPassword(input.token, input.password),
  },

  User: {
    transactions: (parent: { id: string }) =>
      transactionService.listTransactions({ userId: parent.id }),
  },

  Transaction: {
    user: (parent: { userId: string }, _args: unknown, ctx: GraphQLContext) =>
      ctx.loaders.user.load(parent.userId),
  },
} as const;
