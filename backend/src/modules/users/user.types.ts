import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType("CreateUserInput")
export class CreateUserInput {
  @Field(() => String)
  @IsNotEmpty()
  name!: string;

  @Field(() => String)
  @IsEmail()
  email!: string;

  @Field(() => String)
  @MinLength(8)
  password!: string;
}

@InputType("UpdateUserInput")
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  name?: string;
}
