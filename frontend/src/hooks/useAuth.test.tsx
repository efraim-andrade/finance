import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider, useAuth } from "./useAuth";

const mocks = vi.hoisted(() => ({
	clearStore: vi.fn(),
	mutationHandlers: new Map<string, (options?: unknown) => Promise<unknown>>(),
	toastError: vi.fn(),
	toastSuccess: vi.fn(),
}));

vi.mock("@apollo/client/react", () => ({
	useApolloClient: () => ({
		clearStore: mocks.clearStore,
	}),
	useMutation: (document: {
		definitions?: Array<{ name?: { value?: string } }>;
	}) => {
		const operationName = document.definitions?.[0]?.name?.value ?? "";
		const mutate = vi.fn((options?: unknown) => {
			const handler = mocks.mutationHandlers.get(operationName);

			return handler?.(options) ?? Promise.resolve({ data: {} });
		});

		return [mutate, { loading: false }];
	},
}));

vi.mock("sonner", () => ({
	toast: {
		error: mocks.toastError,
		success: mocks.toastSuccess,
	},
}));

function AuthActions() {
	const { deleteAccount, isAuthenticated, login, logout, register, userId } =
		useAuth();

	return (
		<div>
			<span data-testid="auth-state">{String(isAuthenticated)}</span>
			<span data-testid="user-id">{userId ?? "none"}</span>

			<button type="button" onClick={() => void login("next@test.com", "123456")}>Login</button>
			<button
				type="button"
				onClick={() => void register("Next User", "next@test.com", "123456")}
			>
				Register
			</button>
			<button type="button" onClick={() => void logout()}>Logout</button>
			<button type="button" onClick={() => void deleteAccount()}>Delete</button>
		</div>
	);
}

function renderAuthProvider() {
	return render(
		<AuthProvider>
			<AuthActions />
		</AuthProvider>,
	);
}

function persistAuthenticatedUser() {
	localStorage.setItem("finance:auth", "true");
	localStorage.setItem("finance:user-id", "previous-user");
	localStorage.setItem("finance:user-name", "Previous User");
	localStorage.setItem("finance:user-email", "previous@test.com");
	localStorage.setItem("finance:token", "previous-token");
}

function mockAuthMutation(operationName: "CreateUser" | "Login") {
	mocks.mutationHandlers.set(operationName, () =>
		Promise.resolve({
			data: {
				[operationName === "Login" ? "login" : "createUser"]: {
					token: "next-token",
					user: {
						id: "next-user",
						name: "Next User",
						email: "next@test.com",
						createdAt: "2026-05-26T00:00:00.000Z",
						updatedAt: "2026-05-26T00:00:00.000Z",
					},
				},
			},
		}),
	);
}

describe("AuthProvider", () => {
	beforeEach(() => {
		localStorage.clear();
		mocks.clearStore.mockReset();
		mocks.clearStore.mockResolvedValue(undefined);
		mocks.mutationHandlers.clear();
		mocks.toastError.mockReset();
		mocks.toastSuccess.mockReset();
	});

	it("clears Apollo cache when user logs out", async () => {
		persistAuthenticatedUser();
		renderAuthProvider();

		await userEvent.click(screen.getByRole("button", { name: "Logout" }));

		await waitFor(() => expect(mocks.clearStore).toHaveBeenCalledTimes(1));
		expect(screen.getByTestId("auth-state")).toHaveTextContent("false");
		expect(localStorage.getItem("finance:token")).toBeNull();
	});

	it("clears Apollo cache before storing login session", async () => {
		persistAuthenticatedUser();
		mockAuthMutation("Login");
		renderAuthProvider();

		await userEvent.click(screen.getByRole("button", { name: "Login" }));

		await waitFor(() => expect(mocks.clearStore).toHaveBeenCalledTimes(1));
		expect(screen.getByTestId("user-id")).toHaveTextContent("next-user");
		expect(localStorage.getItem("finance:token")).toBe("next-token");
	});

	it("clears Apollo cache before storing register session", async () => {
		persistAuthenticatedUser();
		mockAuthMutation("CreateUser");
		renderAuthProvider();

		await userEvent.click(screen.getByRole("button", { name: "Register" }));

		await waitFor(() => expect(mocks.clearStore).toHaveBeenCalledTimes(1));
		expect(screen.getByTestId("user-id")).toHaveTextContent("next-user");
		expect(localStorage.getItem("finance:token")).toBe("next-token");
	});

	it("clears Apollo cache after deleting account", async () => {
		persistAuthenticatedUser();
		mocks.mutationHandlers.set("DeleteUser", () =>
			Promise.resolve({ data: { deleteUser: "previous-user" } }),
		);
		renderAuthProvider();

		await userEvent.click(screen.getByRole("button", { name: "Delete" }));

		await waitFor(() => expect(mocks.clearStore).toHaveBeenCalledTimes(1));
		expect(screen.getByTestId("auth-state")).toHaveTextContent("false");
		expect(localStorage.getItem("finance:token")).toBeNull();
	});
});
