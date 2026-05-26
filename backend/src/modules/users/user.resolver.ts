import * as transactionService from "@/modules/transactions/transaction.service.js";
import * as userService from "@/modules/users/user.service.js";
import type { UpdateUserInput } from "@/modules/users/user.types.js";
import type { GraphQLContext } from "@/types/index.js";

export const userResolvers = {
  Query: {
    user: (_parent: unknown, { id }: { id: string }) => userService.getUserById(id),
  },
  Mutation: {
    updateUser: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateUserInput },
      context: GraphQLContext,
    ) => userService.updateUser(id, input, context.userId),
    deleteUser: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) =>
      userService.deleteUser(id, context.userId),
  },
  User: {
    transactions: (parent: { id: string }) =>
      transactionService.listTransactions({ userId: parent.id }),
  },
} as const;
