import type { TransactionType } from "@prisma/client";

export type { TransactionType };

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
