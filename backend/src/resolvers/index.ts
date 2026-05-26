import { authResolvers } from "@/modules/auth/auth.resolver.js";
import { categoryResolvers } from "@/modules/categories/category.resolver.js";
import { transactionResolvers } from "@/modules/transactions/transaction.resolver.js";
import { userResolvers } from "@/modules/users/user.resolver.js";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...categoryResolvers.Query,
    ...transactionResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...transactionResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
  Transaction: {
    ...transactionResolvers.Transaction,
  },
} as const;
