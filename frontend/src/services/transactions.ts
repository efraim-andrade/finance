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
  deleteTransaction: string;
};

export type CreateTransactionInput = {
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
};

export type UpdateTransactionInput = {
  description?: string;
  amount?: number;
  type?: "INCOME" | "EXPENSE";
  category?: string;
  date?: string;
};

type TransactionsVariables = {
  month?: string | null;
  year?: string | null;
};

export const GET_TRANSACTIONS: TypedDocumentNode<
  TransactionsData,
  TransactionsVariables
> = gql`
  query GetTransactions($month: String, $year: String) {
    transactions(month: $month, year: $year) {
      id
      description
      amount
      type
      category
      date
      isExample
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
			isExample
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
			isExample
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
		deleteTransaction(id: $id)
	}
`;

type TransactionPeriod = {
  month: string;
  year: string;
};

type TransactionPeriodsData = {
  transactionPeriods: TransactionPeriod[];
};

export const GET_TRANSACTION_PERIODS: TypedDocumentNode<
  TransactionPeriodsData,
  Record<string, never>
> = gql`
  query GetTransactionPeriods {
    transactionPeriods {
      month
      year
    }
  }
`;

export const DELETE_EXAMPLE_TRANSACTIONS: TypedDocumentNode<
  { deleteExampleTransactions: number },
  Record<string, never>
> = gql`
 	mutation DeleteExampleTransactions {
		deleteExampleTransactions
	}
`;
