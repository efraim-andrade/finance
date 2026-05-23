import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "@/schema/typeDefs.js";
import { resolvers } from "@/resolvers/index.js";
import { createLoaders } from "@/loaders/index.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => ({
    loaders: createLoaders(),
  }),
});

console.log(`🚀  GraphQL server ready at: ${url}`);
