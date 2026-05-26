import * as authService from "@/modules/auth/auth.service.js";
import {
  AuthPayload,
  LoginInput,
  MessagePayload,
  RequestPasswordResetInput,
  ResetPasswordInput,
} from "@/modules/auth/auth.types.js";
import { CreateUserInput } from "@/modules/users/user.types.js";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthPayload)
  createUser(@Arg("input", () => CreateUserInput) input: CreateUserInput) {
    return authService.registerUser(input);
  }

  @Mutation(() => AuthPayload)
  login(@Arg("input", () => LoginInput) input: LoginInput) {
    return authService.loginUser(input.email, input.password);
  }

  @Mutation(() => MessagePayload)
  requestPasswordReset(
    @Arg("input", () => RequestPasswordResetInput) input: RequestPasswordResetInput,
  ) {
    return authService.requestPasswordReset(input.email);
  }

  @Mutation(() => MessagePayload)
  resetPassword(@Arg("input", () => ResetPasswordInput) input: ResetPasswordInput) {
    return authService.resetPassword(input.token, input.password);
  }
}
