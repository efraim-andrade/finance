import { afterEach, describe, expect, it, vi } from "vitest";

import * as transactionService from "../services/transaction.js";
import * as userService from "../services/user.js";

import { resolvers } from "./index.js";

describe("resolvers authorization", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("scopes transactions query to authenticated user", async () => {
		const listTransactionsSpy = vi
			.spyOn(transactionService, "listTransactions")
			.mockResolvedValue([]);

		await resolvers.Query.transactions(
			undefined,
			{ month: "05", year: "2026" },
			{ loaders: {} as never, userId: "user-1" },
		);

		expect(listTransactionsSpy).toHaveBeenCalledWith({
			userId: "user-1",
			month: "05",
			year: "2026",
		});
	});

	it("rejects user query for another user", async () => {
		const getUserByIdSpy = vi.spyOn(userService, "getUserById");

		expect(() =>
			resolvers.Query.user(
				undefined,
				{ id: "user-2" },
				{ loaders: {} as never, userId: "user-1" },
			),
		).toThrow("Não autorizado");

		expect(getUserByIdSpy).not.toHaveBeenCalled();
	});

	it("uses authenticated user when deleting example transactions", async () => {
		const deleteExamplesSpy = vi
			.spyOn(transactionService, "deleteExampleTransactions")
			.mockResolvedValue(3);

		await resolvers.Mutation.deleteExampleTransactions(
			undefined,
			undefined,
			{ loaders: {} as never, userId: "user-1" },
		);

		expect(deleteExamplesSpy).toHaveBeenCalledWith("user-1");
	});
});
