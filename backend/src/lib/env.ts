import { z } from "zod";

const envSchema = z.object({
  BACKEND_PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  FRONTEND_ORIGIN: z.string().url().optional(),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  if (process.env.VITEST) {
    throw new Error(`Invalid environment variables:\n${message}`);
  }

  console.error("Invalid environment variables:\n", message);
  process.exit(1);
}

export const env = parsed.data;

export type Env = z.infer<typeof envSchema>;
