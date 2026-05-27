import { Field, InputType } from "type-graphql";

@InputType("CreateCategoryInput")
export class CreateCategoryInput {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String)
  color!: string;

  @Field(() => String)
  icon!: string;

  userId?: string;
}

@InputType("UpdateCategoryInput")
export class UpdateCategoryInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true })
  color?: string;

  @Field(() => String, { nullable: true })
  icon?: string;
}
