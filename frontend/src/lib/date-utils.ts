export const DATE_INPUT_LENGTH = 10;

export function isValidDateInput(value: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;

  const [day, month, year] = value.split("/").map(Number);

  if (month < 1 || month > 12) return false;
  if (day < 1) return false;

  const daysInMonth = new Date(year, month, 0).getDate();

  return day <= daysInMonth;
}
