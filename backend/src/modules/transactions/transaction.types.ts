import { TransactionType } from "@prisma/client";
import { IsISO8601, IsNotEmpty, IsOptional, IsPositive } from "class-validator";
import { Field, Float, InputType } from "type-graphql";

export type { TransactionType };

@InputType("CreateTransactionInput")
export class CreateTransactionInput {
  @Field(() => String)
  @IsNotEmpty()
  description!: string;

  @Field(() => Float)
  @IsPositive()
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String)
  @IsNotEmpty()
  category!: string;

  @Field(() => String)
  @IsISO8601()
  date!: string;
}

@InputType("UpdateTransactionInput")
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsPositive()
  amount?: number;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  category?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsISO8601()
  date?: string;
}
