import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { buildContext } from "@/app/context.js";
import { resolvers } from "@/resolvers/index.js";
import { typeDefs } from "@/schema/typeDefs.js";

const DEFAULT_PORT = 4000;

export async function startGraphQLServer(port = DEFAULT_PORT) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
  });

  return startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => buildContext(req.headers.authorization),
  });
}
