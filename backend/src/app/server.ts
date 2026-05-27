import "reflect-metadata";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import { GraphQLISODateTime, buildSchema } from "type-graphql";

import { buildContext } from "@/app/context.js";
import { env } from "@/lib/env.js";
import { AuthResolver } from "@/modules/auth/auth.resolver.js";
import { CategoryResolver } from "@/modules/categories/category.resolver.js";
import { errorHandlerMiddleware } from "@/modules/shared/middlewares/error-handler.js";
import { TransactionResolver } from "@/modules/transactions/transaction.resolver.js";
import { UserResolver } from "@/modules/users/user.resolver.js";

const DEFAULT_PORT = env.BACKEND_PORT;

const ALLOWED_ORIGIN_PATTERN = /^https?:\/\/localhost(?::\d+)?$/;
const IS_DEV = env.NODE_ENV !== "production";

function resolveCorsOrigin(
  requestOrigin: string | undefined,
  callback: (error: Error | null, origin?: boolean) => void,
) {
  if (!requestOrigin) {
    callback(null, false);
    return;
  }

  if (IS_DEV) {
    callback(null, ALLOWED_ORIGIN_PATTERN.test(requestOrigin));
    return;
  }

  callback(null, requestOrigin === env.FRONTEND_ORIGIN);
}

export function createGraphQLSchema() {
  return buildSchema({
    resolvers: [AuthResolver, UserResolver, CategoryResolver, TransactionResolver],
    globalMiddlewares: [errorHandlerMiddleware],
    scalarsMap: [{ type: Date, scalar: GraphQLISODateTime }],
    validate: false,
  });
}

export async function startGraphQLServer(port = DEFAULT_PORT) {
  const schema = await createGraphQLSchema();

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
  });

  await server.start();

  const app = express();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: resolveCorsOrigin,
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => buildContext(req.headers.authorization),
    }),
  );

  return new Promise<{ url: string }>((resolve) => {
    app.listen(port, () => {
      resolve({ url: `http://localhost:${port}/graphql` });
    });
  });
}
