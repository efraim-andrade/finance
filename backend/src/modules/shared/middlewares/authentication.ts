import { createMethodMiddlewareDecorator, type MiddlewareFn } from "type-graphql";

import { unauthenticated } from "@/modules/shared/errors.js";
import type { GraphQLContext } from "@/types/index.js";

export const authenticationMiddleware: MiddlewareFn<GraphQLContext> = async ({ context }, next) => {
  if (!context.userId) {
    throw unauthenticated();
  }

  context.authenticatedUserId = context.userId;

  return next();
};

export const Authenticated = () =>
  createMethodMiddlewareDecorator<GraphQLContext>(authenticationMiddleware);

export function getAuthenticatedUserId(context: GraphQLContext) {
  if (!context.authenticatedUserId) {
    throw unauthenticated();
  }

  return context.authenticatedUserId;
}
