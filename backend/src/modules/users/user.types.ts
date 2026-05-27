import { Field, InputType } from "type-graphql";

@InputType("CreateUserInput")
export class CreateUserInput {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

@InputType("UpdateUserInput")
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  name?: string;
}
