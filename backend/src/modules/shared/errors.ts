import { GraphQLError } from "graphql";

type GraphQLErrorCode =
  | "BAD_USER_INPUT"
  | "FORBIDDEN"
  | "INTERNAL_SERVER_ERROR"
  | "NOT_FOUND"
  | "UNAUTHENTICATED";

export const publicGraphQLErrorCodes = new Set<string>([
  "BAD_USER_INPUT",
  "FORBIDDEN",
  "GRAPHQL_VALIDATION_FAILED",
  "INTERNAL_SERVER_ERROR",
  "NOT_FOUND",
  "UNAUTHENTICATED",
]);

function createGraphQLError(message: string, code: GraphQLErrorCode) {
  return new GraphQLError(message, {
    extensions: { code },
  });
}

export function badUserInput(message: string) {
  return createGraphQLError(message, "BAD_USER_INPUT");
}

export function forbidden(message = "Não autorizado") {
  return createGraphQLError(message, "FORBIDDEN");
}

export function notFound(message: string) {
  return createGraphQLError(message, "NOT_FOUND");
}

export function internalServerError(message = "Erro interno do servidor") {
  return createGraphQLError(message, "INTERNAL_SERVER_ERROR");
}

export function unauthenticated(message = "Usuário não autenticado. Faça login novamente.") {
  return createGraphQLError(message, "UNAUTHENTICATED");
}
