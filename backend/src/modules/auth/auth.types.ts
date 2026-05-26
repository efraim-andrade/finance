import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

import { UserModel } from "@/schema/models.js";

@InputType("LoginInput")
export class LoginInput {
  @Field(() => String)
  @IsEmail()
  email!: string;

  @Field(() => String)
  @MinLength(8)
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
  @IsEmail()
  email!: string;
}

@InputType("ResetPasswordInput")
export class ResetPasswordInput {
  @Field(() => String)
  @IsNotEmpty()
  token!: string;

  @Field(() => String)
  @MinLength(8)
  password!: string;
}

@ObjectType("MessagePayload")
export class MessagePayload {
  @Field(() => String)
  message!: string;
}
