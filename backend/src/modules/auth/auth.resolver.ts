import * as authService from "@/modules/auth/auth.service.js";
import type {
  LoginInput,
  RequestPasswordResetInput,
  ResetPasswordInput,
} from "@/modules/auth/auth.types.js";
import type { CreateUserInput } from "@/modules/users/user.types.js";

export const authResolvers = {
  Mutation: {
    createUser: (_parent: unknown, { input }: { input: CreateUserInput }) =>
      authService.registerUser(input),
    login: (_parent: unknown, { input }: { input: LoginInput }) =>
      authService.loginUser(input.email, input.password),
    requestPasswordReset: (_parent: unknown, { input }: { input: RequestPasswordResetInput }) =>
      authService.requestPasswordReset(input.email),
    resetPassword: (_parent: unknown, { input }: { input: ResetPasswordInput }) =>
      authService.resetPassword(input.token, input.password),
  },
} as const;
