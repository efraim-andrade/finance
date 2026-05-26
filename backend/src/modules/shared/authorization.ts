import { forbidden, unauthenticated } from "@/modules/shared/errors.js";

const UNAUTHENTICATED_MESSAGE = "Usuário não autenticado. Faça login novamente.";
const UNAUTHORIZED_MESSAGE = "Não autorizado";

export function requireAuthenticatedUserId(userId?: string): string {
  if (!userId) {
    throw unauthenticated(UNAUTHENTICATED_MESSAGE);
  }

  return userId;
}

export function assertSameUser(resourceUserId: string, userId: string) {
  if (resourceUserId !== userId) {
    throw forbidden(UNAUTHORIZED_MESSAGE);
  }
}
