// Temporary types mirroring GraphQL schema.
// TODO: replace with graphql-codegen output.

import type { TransactionType } from "@prisma/client";

export type { TransactionType };

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthPayload = {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  token: string;
};

export type CreateTransactionInput = {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  userId: string;
  isExample?: boolean;
};

export type UpdateTransactionInput = {
  description?: string;
  amount?: number;
  type?: TransactionType;
  category?: string;
  date?: string;
  isExample?: boolean;
};

export type UpdateUserInput = {
  name?: string;
};

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  color: string;
  icon: string;
  userId?: string;
};

export type UpdateCategoryInput = {
  name?: string;
  description?: string | null;
  color?: string;
  icon?: string;
};

export type RequestPasswordResetInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
};

export type MessagePayload = {
  message: string;
};
