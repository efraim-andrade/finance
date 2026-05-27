import jwt from "jsonwebtoken";

import { env } from "@/lib/env.js";

type JwtPayload = {
  purpose: TokenPurpose;
  userId: string;
};

type TokenPurpose = "access" | "password_reset";

const JWT_SECRET = env.JWT_SECRET;

export function signAccessToken(userId: string): string {
  return jwt.sign({ purpose: "access", userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function signResetToken(userId: string): string {
  return jwt.sign({ purpose: "password_reset", userId }, JWT_SECRET, { expiresIn: "1h" });
}

function verifyTokenPurpose(token: string, purpose: TokenPurpose): JwtPayload {
  const payload = jwt.verify(token, JWT_SECRET);

  if (
    typeof payload !== "object" ||
    payload === null ||
    payload.purpose !== purpose ||
    typeof payload.userId !== "string"
  ) {
    throw new Error("Token inválido ou expirado");
  }

  return { purpose, userId: payload.userId };
}

export function verifyAccessToken(token: string) {
  return verifyTokenPurpose(token, "access");
}

export function verifyResetToken(token: string) {
  return verifyTokenPurpose(token, "password_reset");
}
