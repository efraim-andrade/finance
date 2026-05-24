import { useMutation, useQuery } from "@apollo/client/react";
import { useCallback, useMemo } from "react";

import { buildCategoryMetaMap } from "#/lib/category-utils";
import { LIST_CATEGORIES } from "#/services/categories";
import {
	CREATE_TRANSACTION,
	type CreateTransactionInput,
	DELETE_TRANSACTION,
	GET_TRANSACTIONS,
	UPDATE_TRANSACTION,
	type UpdateTransactionInput,
} from "#/services/transactions";
import type { Transaction } from "#/types/dashboard";

function displayDate(iso: string): string {
	const date = new Date(iso);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
}

function dateToISO(date: string): string {
	if (date.includes("T")) return date;

	const [day, month, year] = date.split("/");

	return `${year}-${month}-${day}T00:00:00.000Z`;
}

function normalizeTransaction(raw: Transaction): Transaction {
	return {
		...raw,
		date: displayDate(raw.date),
	};
}

export function useTransactions() {
	const { data, loading, error } = useQuery(GET_TRANSACTIONS);
	const { data: catData } = useQuery(LIST_CATEGORIES);

	const categoryMetaMap = useMemo(
		() => buildCategoryMetaMap(catData?.categories ?? []),
		[catData],
	);

	const [doCreate, createState] = useMutation(CREATE_TRANSACTION, {
		refetchQueries: ["GetTransactions"],
	});

	const [doUpdate, updateState] = useMutation(UPDATE_TRANSACTION, {
		refetchQueries: ["GetTransactions"],
	});

	const [doDelete, deleteState] = useMutation(DELETE_TRANSACTION, {
		refetchQueries: ["GetTransactions"],
	});

	const transactions = useMemo(
		() => (data?.transactions ?? []).map(normalizeTransaction),
		[data],
	);

	const createTransaction = useCallback(
		async (input: CreateTransactionInput) => {
			if (!input.userId) {
				throw new Error(
					"Usuário não autenticado. Faça login novamente.",
				);
			}

			await doCreate({
				variables: { input: { ...input, date: dateToISO(input.date) } },
			});
		},
		[doCreate],
	);

	const updateTransaction = useCallback(
		async (id: string, input: UpdateTransactionInput) => {
			const updated = input.date
				? { ...input, date: dateToISO(input.date) }
				: input;

			await doUpdate({ variables: { id, input: updated } });
		},
		[doUpdate],
	);

	const deleteTransaction = useCallback(
		async (id: string) => {
			await doDelete({ variables: { id } });
		},
		[doDelete],
	);

	return {
		transactions,
		categoryMetaMap,
		loading,
		error,
		createTransaction,
		createLoading: createState.loading,
		updateTransaction,
		updateLoading: updateState.loading,
		deleteTransaction,
		deleteLoading: deleteState.loading,
	};
}
