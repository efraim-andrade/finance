import { IsNotEmpty, IsOptional } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType("CreateCategoryInput")
export class CreateCategoryInput {
  @Field(() => String)
  @IsNotEmpty()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string | null;

  @Field(() => String)
  @IsNotEmpty()
  color!: string;

  @Field(() => String)
  @IsNotEmpty()
  icon!: string;

  userId?: string;
}

@InputType("UpdateCategoryInput")
export class UpdateCategoryInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  color?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  icon?: string;
}
