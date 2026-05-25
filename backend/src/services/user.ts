import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { TransactionType } from "@prisma/client";

import { prisma } from "@/lib/prisma.js";
import type { CreateUserInput, MessagePayload, UpdateUserInput } from "@/types/graphql.js";

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES = [
  { name: "Carro", description: "", color: "purple", icon: "car" },
  { name: "Entretenimento", description: "", color: "pink", icon: "ticket" },
  { name: "Investimentos", description: "", color: "green", icon: "receipt" },
  { name: "Mercado", description: "", color: "orange", icon: "cart" },
  { name: "Renda Fixa", description: "", color: "green", icon: "piggy" },
  { name: "Salário", description: "", color: "green", icon: "piggy" },
  { name: "Saúde", description: "", color: "red", icon: "dumbbell" },
  { name: "Utilidades", description: "", color: "yellow", icon: "wrench" },
];

const EXAMPLE_TRANSACTIONS: {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
}[] = [
  { description: "Salário mensal", amount: 5000, type: "INCOME", category: "Salário" },
  { description: "Mercado mensal", amount: 650, type: "EXPENSE", category: "Mercado" },
  { description: "Gasolina", amount: 200, type: "EXPENSE", category: "Carro" },
  { description: "Farmácia", amount: 89.9, type: "EXPENSE", category: "Saúde" },
  { description: "Streaming", amount: 55.9, type: "EXPENSE", category: "Entretenimento" },
  { description: "Conta de luz", amount: 180, type: "EXPENSE", category: "Utilidades" },
  { description: "CDB", amount: 300, type: "INCOME", category: "Renda Fixa" },
  { description: "Ações", amount: 500, type: "INCOME", category: "Investimentos" },
];

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysAgo(days: number): Date {
  const d = new Date();

  d.setDate(d.getDate() - days);

  return d;
}

function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "7d" });
}

function generateResetToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "1h" });
}

// ─── User CRUD ───────────────────────────────────────────────────────────────

export async function listUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(input: CreateUserInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new Error("Já existe uma conta com este e-mail");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
  });

  await ensureDefaultCategories();
  await seedExampleTransactions(user.id);

  const token = generateToken(user.id);

  return { user, token };
}

export async function updateUser(id: string, input: UpdateUserInput, userId?: string) {
  if (id !== userId) {
    throw new Error("Não autorizado");
  }

  return prisma.user.update({ where: { id }, data: input });
}

export async function deleteUser(id: string, userId?: string) {
  if (id !== userId) {
    throw new Error("Não autorizado");
  }

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  await prisma.transaction.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  return id;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("E-mail ou senha inválidos");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    throw new Error("E-mail ou senha inválidos");
  }

  const token = generateToken(user.id);

  return { user, token };
}

// ─── Password Reset ──────────────────────────────────────────────────────────

// NOTE: In-memory rate limiter — does not survive restarts and will not
// work across multiple server instances. For production, use a shared
// store like Redis or a database-backed rate limiter.
const resetRateLimit = new Map<string, number>();
const RESET_RATE_LIMIT_MS = 120_000; // 2 minutes

async function ensureDefaultCategories() {
  const existing = await prisma.category.findFirst();

  if (existing) return;

  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES,
  });
}

async function seedExampleTransactions(userId: string) {
  await prisma.transaction.createMany({
    data: EXAMPLE_TRANSACTIONS.map((t, i) => ({
      description: t.description,
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: daysAgo(i * 5),
      userId,
      isExample: true,
    })),
  });
}

export async function requestPasswordReset(email: string): Promise<MessagePayload> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const lastRequest = resetRateLimit.get(email);

    if (!lastRequest || Date.now() - lastRequest > RESET_RATE_LIMIT_MS) {
      resetRateLimit.set(email, Date.now());

      // invalidate any existing reset token before creating new one
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: null, resetTokenExpiresAt: null },
      });

      const resetToken = generateResetToken(user.id);
      const expiresAt = new Date(Date.now() + 3600000); // 1h

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiresAt: expiresAt },
      });
    }
  }

  return {
    message: "Se o e-mail existir, você receberá um link de recuperação",
  };
}

export async function resetPassword(token: string, password: string): Promise<MessagePayload> {
  let payload: { userId: string };

  try {
    payload = jwt.verify(token, JWT_SECRET!) as { userId: string };
  } catch {
    throw new Error("Token inválido ou expirado");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: payload.userId,
      resetToken: token,
      resetTokenExpiresAt: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error("Token inválido ou expirado");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });

  return { message: "Senha redefinida com sucesso" };
}
