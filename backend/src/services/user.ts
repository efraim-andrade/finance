import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "@/lib/prisma.js";
import type { CreateUserInput } from "@/types/graphql.js";

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

const DEFAULT_CATEGORIES = [
  {
    name: "Alimentação",
    description: "Refeições, delivery, mercado",
    color: "green",
    icon: "utensils",
  },
  { name: "Transporte", description: "Gasolina, Uber, ônibus", color: "blue", icon: "car" },
  { name: "Moradia", description: "Aluguel, condomínio, contas", color: "orange", icon: "house" },
  { name: "Lazer", description: "Cinema, jogos, hobbies", color: "purple", icon: "ticket" },
  { name: "Saúde", description: "Farmácia, plano de saúde", color: "red", icon: "heart" },
  { name: "Educação", description: "Cursos, livros", color: "pink", icon: "book" },
  { name: "Salário", description: "Rendimentos do trabalho", color: "green", icon: "briefcase" },
  { name: "Freelance", description: "Trabalhos autônomos", color: "blue", icon: "piggy" },
];

const EXAMPLE_TRANSACTIONS = [
  { description: "Salário mensal", amount: 5000, type: "INCOME", category: "Salário" },
  { description: "Almoço no restaurante", amount: 45.9, type: "EXPENSE", category: "Alimentação" },
  { description: "Uber para o trabalho", amount: 18.5, type: "EXPENSE", category: "Transporte" },
  { description: "Projeto freela", amount: 1200, type: "INCOME", category: "Freelance" },
  { description: "Netflix mensal", amount: 55.9, type: "EXPENSE", category: "Lazer" },
];

function daysAgo(days: number): Date {
  const d = new Date();

  d.setDate(d.getDate() - days);

  return d;
}

async function seedCategories() {
  const count = await prisma.category.count();

  if (count > 0) return;

  try {
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES,
    });
  } catch {
    // categories already seeded by another concurrent request
  }
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

  await seedCategories();
  await seedExampleTransactions(user.id);

  const token = generateToken(user.id);

  return { user, token };
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
