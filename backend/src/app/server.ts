import "reflect-metadata";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLISODateTime, buildSchema } from "type-graphql";

import { buildContext } from "@/app/context.js";
import { AuthResolver } from "@/modules/auth/auth.resolver.js";
import { CategoryResolver } from "@/modules/categories/category.resolver.js";
import { TransactionResolver } from "@/modules/transactions/transaction.resolver.js";
import { UserResolver } from "@/modules/users/user.resolver.js";

const DEFAULT_PORT = 4000;

export function createGraphQLSchema() {
  return buildSchema({
    resolvers: [AuthResolver, UserResolver, CategoryResolver, TransactionResolver],
    scalarsMap: [{ type: Date, scalar: GraphQLISODateTime }],
    validate: true,
  });
}

export async function startGraphQLServer(port = DEFAULT_PORT) {
  const schema = await createGraphQLSchema();

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
  });

  return startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => buildContext(req.headers.authorization),
  });
}
