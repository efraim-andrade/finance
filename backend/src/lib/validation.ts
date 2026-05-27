import { ZodError, z } from "zod";

import { badUserInput } from "@/modules/shared/errors.js";

export function validateOrThrow<T>(schema: z.ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (err) {
    if (err instanceof ZodError) {
      const message = err.issues.map((issue) => issue.message).join("; ");

      throw badUserInput(message);
    }

    throw err;
  }
}

export const createUserSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(100),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres").max(128),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Nome da categoria obrigatório").max(24),
  description: z.string().max(200).optional().nullable().default(""),
  color: z.string().min(1, "Cor obrigatória"),
  icon: z.string().min(1, "Ícone obrigatório").max(50),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createTransactionSchema = z.object({
  description: z.string().min(1, "Descrição obrigatória").max(200),
  amount: z.number().positive("Valor deve ser positivo").finite(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Categoria obrigatória"),
  date: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
});

export const updateTransactionSchema = createTransactionSchema.partial();
