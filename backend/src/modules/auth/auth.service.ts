import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma.js";
import { signAccessToken, signResetToken, verifyResetToken } from "@/modules/auth/auth.tokens.js";
import { badUserInput, unauthenticated } from "@/modules/shared/errors.js";
import type { CreateUserInput } from "@/modules/users/user.types.js";
import { seedUserWorkspace } from "@/modules/users/user.seed.js";

const resetRateLimit = new Map<string, number>();
const RESET_RATE_LIMIT_MS = 120_000;
const RESET_TOKEN_TTL_MS = 3_600_000;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function registerUser(input: CreateUserInput) {
  const email = normalizeEmail(input.email);
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw badUserInput("Já existe uma conta com este e-mail");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.$transaction(async (transaction) => {
    const createdUser = await transaction.user.create({
      data: {
        name: input.name,
        email,
        passwordHash,
      },
    });

    await seedUserWorkspace(transaction, createdUser.id);

    return createdUser;
  });

  return {
    user,
    token: signAccessToken(user.id),
  };
}

export async function loginUser(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user) {
    throw unauthenticated("E-mail ou senha inválidos");
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) {
    throw unauthenticated("E-mail ou senha inválidos");
  }

  return {
    user,
    token: signAccessToken(user.id),
  };
}

export async function requestPasswordReset(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (user) {
    const lastRequest = resetRateLimit.get(normalizedEmail);

    if (!lastRequest || Date.now() - lastRequest > RESET_RATE_LIMIT_MS) {
      resetRateLimit.set(normalizedEmail, Date.now());

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: null, resetTokenExpiresAt: null },
      });

      const resetToken = signResetToken(user.id);
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

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

export async function resetPassword(token: string, password: string) {
  let payload: { userId: string };

  try {
    payload = verifyResetToken(token);
  } catch {
    throw badUserInput("Token inválido ou expirado");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: payload.userId,
      resetToken: token,
      resetTokenExpiresAt: { gt: new Date() },
    },
  });

  if (!user) {
    throw badUserInput("Token inválido ou expirado");
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

  return { message: "Senha alterada com sucesso" };
}
