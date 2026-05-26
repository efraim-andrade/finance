const UNAUTHENTICATED_MESSAGE = "Usuário não autenticado. Faça login novamente.";
const UNAUTHORIZED_MESSAGE = "Não autorizado";

export function requireAuthenticatedUserId(userId?: string): string {
  if (!userId) {
    throw new Error(UNAUTHENTICATED_MESSAGE);
  }

  return userId;
}

export function assertSameUser(resourceUserId: string, userId: string) {
  if (resourceUserId !== userId) {
    throw new Error(UNAUTHORIZED_MESSAGE);
  }
}
