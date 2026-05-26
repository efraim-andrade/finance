import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: string;
};

const JWT_SECRET = getJwtSecret();

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  return secret;
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function signResetToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string): JwtPayload {
  const payload = jwt.verify(token, JWT_SECRET);

  if (typeof payload !== "object" || payload === null || typeof payload.userId !== "string") {
    throw new Error("Token inválido ou expirado");
  }

  return { userId: payload.userId };
}
