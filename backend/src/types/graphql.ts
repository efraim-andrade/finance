// Temporary types mirroring GraphQL schema.
// TODO: replace with graphql-codegen output.

export type TransactionType = "INCOME" | "EXPENSE";

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export type CreateTransactionInput = {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  userId: string;
};

export type UpdateTransactionInput = {
  description?: string;
  amount?: number;
  type?: TransactionType;
  category?: string;
  date?: string;
};

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  color: string;
  icon: string;
};
