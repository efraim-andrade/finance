import type { TypedDocumentNode } from "@apollo/client";
import { gql } from "@apollo/client";

import type { Transaction } from "#/types/dashboard";

type TransactionsData = {
  transactions: Transaction[];
};

type CreateTransactionData = {
  createTransaction: Transaction;
};

type UpdateTransactionData = {
  updateTransaction: Transaction;
};

type DeleteTransactionData = {
  deleteTransaction: Transaction;
};

export type CreateTransactionInput = {
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
  userId?: string;
};

export type UpdateTransactionInput = {
  description?: string;
  amount?: number;
  type?: "INCOME" | "EXPENSE";
  category?: string;
  date?: string;
};

export const GET_TRANSACTIONS: TypedDocumentNode<TransactionsData> = gql`
	query GetTransactions {
		transactions {
			id
			description
			amount
			type
			category
			date
			createdAt
			updatedAt
		}
	}
`;

export const CREATE_TRANSACTION: TypedDocumentNode<
  CreateTransactionData,
  { input: CreateTransactionInput }
> = gql`
	mutation CreateTransaction($input: CreateTransactionInput!) {
		createTransaction(input: $input) {
			id
			description
			amount
			type
			category
			date
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_TRANSACTION: TypedDocumentNode<
  UpdateTransactionData,
  { id: string; input: UpdateTransactionInput }
> = gql`
	mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
		updateTransaction(id: $id, input: $input) {
			id
			description
			amount
			type
			category
			date
			createdAt
			updatedAt
		}
	}
`;

export const DELETE_TRANSACTION: TypedDocumentNode<
  DeleteTransactionData,
  { id: string }
> = gql`
	mutation DeleteTransaction($id: ID!) {
		deleteTransaction(id: $id) {
			id
		}
	}
`;
