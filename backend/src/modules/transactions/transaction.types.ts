import { TransactionType } from "@prisma/client";
import { Field, Float, InputType } from "type-graphql";

export type { TransactionType };

@InputType("CreateTransactionInput")
export class CreateTransactionInput {
  @Field(() => String)
  description!: string;

  @Field(() => Float)
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String)
  category!: string;

  @Field(() => String)
  date!: string;
}

@InputType("UpdateTransactionInput")
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  date?: string;
}
