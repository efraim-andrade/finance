import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "@/lib/prisma.js";
import type { CreateUserInput, UpdateUserInput } from "@/types/graphql.js";

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

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export async function listUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "7d" });
}

const EXAMPLE_TRANSACTIONS = [
  { description: "Salário mensal", amount: 5000, type: "INCOME", category: "Salário" },
  { description: "Mercado mensal", amount: 650, type: "EXPENSE", category: "Mercado" },
  { description: "Gasolina", amount: 200, type: "EXPENSE", category: "Carro" },
  { description: "Farmácia", amount: 89.9, type: "EXPENSE", category: "Saúde" },
  { description: "Streaming", amount: 55.9, type: "EXPENSE", category: "Entretenimento" },
  { description: "Conta de luz", amount: 180, type: "EXPENSE", category: "Utilidades" },
  { description: "CDB", amount: 300, type: "INCOME", category: "Renda Fixa" },
  { description: "Ações", amount: 500, type: "INCOME", category: "Investimentos" },
];

function daysAgo(days: number): Date {
  const d = new Date();

  d.setDate(d.getDate() - days);

  return d;
}

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

export async function deleteUser(id: string) {
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
