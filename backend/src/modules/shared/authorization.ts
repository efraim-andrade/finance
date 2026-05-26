import { forbidden, unauthenticated } from "@/modules/shared/errors.js";

const UNAUTHENTICATED_MESSAGE = "Usuário não autenticado. Faça login novamente.";
const UNAUTHORIZED_MESSAGE = "Não autorizado";

export function assertAuthenticatedUserId(userId: unknown): string {
  if (typeof userId !== "string" || userId.length === 0) {
    throw unauthenticated(UNAUTHENTICATED_MESSAGE);
  }

  return userId;
}

export function assertSameUser(resourceUserId: string, userId: string) {
  if (resourceUserId !== userId) {
    throw forbidden(UNAUTHORIZED_MESSAGE);
  }
}
