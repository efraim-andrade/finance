import { TransactionType } from "@prisma/client";
import { Field, Float, ID, ObjectType, registerEnumType } from "type-graphql";

registerEnumType(TransactionType, {
  name: "TransactionType",
});

@ObjectType("User")
export class UserModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => [TransactionModel])
  transactions!: TransactionModel[];

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType("Transaction")
export class TransactionModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  description!: string;

  @Field(() => Float)
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String)
  category!: string;

  @Field(() => Date)
  date!: Date;

  @Field(() => UserModel)
  user!: UserModel;

  @Field(() => Boolean)
  isExample!: boolean;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType("Category")
export class CategoryModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  description!: string;

  @Field(() => String)
  color!: string;

  @Field(() => String)
  icon!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType("TransactionPeriod")
export class TransactionPeriodModel {
  @Field(() => String)
  month!: string;

  @Field(() => String)
  year!: string;
}
