import { createLoaders } from "@/loaders/index.js";
import { verifyToken } from "@/modules/auth/auth.tokens.js";

export async function buildContext(authorizationHeader?: string) {
  const token = authorizationHeader?.startsWith("Bearer ") ? authorizationHeader.slice(7) : null;

  let userId: string | undefined;

  if (token) {
    try {
      const payload = verifyToken(token);

      userId = payload.userId;
    } catch {
      userId = undefined;
    }
  }

  return {
    loaders: createLoaders(),
    userId,
  };
}
