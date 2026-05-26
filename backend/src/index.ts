import { startGraphQLServer } from "@/app/server.js";

const { url } = await startGraphQLServer();

console.log(`🚀  GraphQL server ready at: ${url}`);
