import { GraphQLError } from "graphql";
import type { MiddlewareFn } from "type-graphql";

import {
  badUserInput,
  internalServerError,
  notFound,
  publicGraphQLErrorCodes,
} from "@/modules/shared/errors.js";
import type { GraphQLContext } from "@/types/index.js";

type ErrorWithCode = {
  code?: string;
  message?: string;
  name?: string;
  stack?: string;
};

function isErrorWithCode(error: unknown): error is ErrorWithCode {
  return typeof error === "object" && error !== null;
}

function logUnknownError(error: unknown) {
  const message = error instanceof Error ? (error.stack ?? error.message) : String(error);

  process.stderr.write(`[graphql] unknown resolver error\n${message}\n`);
}

export const errorHandlerMiddleware: MiddlewareFn<GraphQLContext> = async (_action, next) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof GraphQLError) {
      const code = error.extensions.code;

      if (typeof code === "string" && publicGraphQLErrorCodes.has(code)) {
        throw error;
      }

      logUnknownError(error);

      throw internalServerError();
    }

    if (isErrorWithCode(error)) {
      if (error.name === "ArgumentValidationError") {
        throw badUserInput("Dados de entrada inválidos");
      }

      if (error.code === "P2002") {
        throw badUserInput("Registro duplicado");
      }

      if (error.code === "P2025") {
        throw notFound("Registro não encontrado");
      }
    }

    logUnknownError(error);

    throw internalServerError();
  }
};
