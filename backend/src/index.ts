import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import jwt from "jsonwebtoken";
import { createLoaders } from "@/loaders/index.js";
import { resolvers } from "@/resolvers/index.js";
import { typeDefs } from "@/schema/typeDefs.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    let userId: string | undefined;

    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        userId = payload.userId;
      } catch {
        // invalid token — userId stays undefined
      }
    }

    return {
      loaders: createLoaders(),
      userId,
    };
  },
});

console.log(`🚀  GraphQL server ready at: ${url}`);
