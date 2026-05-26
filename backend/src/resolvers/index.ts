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
    user: (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      if (!ctx.userId || id !== ctx.userId) {
        throw new Error("Não autorizado");
      }

      return userService.getUserById(id);
    },
    transactions: (
      _parent: unknown,
      {
        month,
        year,
      }: {
        month?: string | null;
        year?: string | null;
      },
      ctx: GraphQLContext,
    ) => transactionService.listTransactions({ userId: ctx.userId, month, year }),
    transaction: (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      transactionService.getTransactionById(id, ctx.userId),
    categories: (_parent: unknown, _args: unknown, ctx: GraphQLContext) =>
      categoryService.listCategories(ctx.userId),
    category: (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      categoryService.getCategoryById(id, ctx.userId),
    transactionPeriods: (_parent: unknown, _args: unknown, ctx: GraphQLContext) =>
      transactionService.listTransactionPeriods(ctx.userId),
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
    deleteUser: (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      userService.deleteUser(id, ctx.userId),
    createTransaction: (
      _parent: unknown,
      { input }: { input: CreateTransactionInput },
      ctx: GraphQLContext,
    ) => transactionService.createTransaction(input, ctx.userId),
    updateTransaction: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateTransactionInput },
      ctx: GraphQLContext,
    ) => transactionService.updateTransaction(id, input, ctx.userId),
    deleteTransaction: (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      transactionService.deleteTransaction(id, ctx.userId),
    createCategory: (
      _parent: unknown,
      { input }: { input: CreateCategoryInput },
      ctx: GraphQLContext,
    ) => {
      if (!ctx.userId) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      return categoryService.createCategory(input, ctx.userId);
    },
    updateCategory: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateCategoryInput },
      ctx: GraphQLContext,
    ) => categoryService.updateCategory(id, input, ctx.userId),
    deleteCategory: (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      categoryService.deleteCategory(id, ctx.userId),
    deleteExampleTransactions: (
      _parent: unknown,
      _args: unknown,
      ctx: GraphQLContext,
    ) => transactionService.deleteExampleTransactions(ctx.userId),
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
