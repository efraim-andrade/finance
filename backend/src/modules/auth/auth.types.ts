import { Field, InputType, ObjectType } from "type-graphql";

import { UserModel } from "@/schema/models.js";

@InputType("LoginInput")
export class LoginInput {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

@ObjectType("AuthPayload")
export class AuthPayload {
  @Field(() => UserModel)
  user!: UserModel;

  @Field(() => String)
  token!: string;
}

@InputType("RequestPasswordResetInput")
export class RequestPasswordResetInput {
  @Field(() => String)
  email!: string;
}

@InputType("ResetPasswordInput")
export class ResetPasswordInput {
  @Field(() => String)
  token!: string;

  @Field(() => String)
  password!: string;
}

@ObjectType("MessagePayload")
export class MessagePayload {
  @Field(() => String)
  message!: string;
}
