import type { Loaders } from "@/loaders/index.js";

export type GraphQLContext = {
  authenticatedUserId?: string;
  loaders: Loaders;
  userId?: string;
};
