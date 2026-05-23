export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function parseBRL(formatted: string): number {
  const digits = formatted.replace(/\D/g, "");
  const cents = Number.parseInt(digits, 10) || 0;

  return cents / 100;
}
