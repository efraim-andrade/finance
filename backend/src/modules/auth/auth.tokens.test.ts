import { beforeEach, describe, expect, it, vi } from "vitest";

describe("auth tokens", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.JWT_SECRET = "test-secret";
  });

  it("does not accept password reset token as access token", async () => {
    const { signResetToken, verifyAccessToken } = await import("@/modules/auth/auth.tokens.js");
    const resetToken = signResetToken("user-id");

    expect(() => verifyAccessToken(resetToken)).toThrow("Token inválido ou expirado");
  });

  it("does not accept access token as password reset token", async () => {
    const { signAccessToken, verifyResetToken } = await import("@/modules/auth/auth.tokens.js");
    const accessToken = signAccessToken("user-id");

    expect(() => verifyResetToken(accessToken)).toThrow("Token inválido ou expirado");
  });
});
