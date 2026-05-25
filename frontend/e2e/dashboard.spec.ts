import { test, expect } from "@playwright/test";

/**
 * Login via localStorage then rely on client-side redirect.
 * SSR beforeLoad cannot read localStorage, so goto("/app") fails.
 * Instead goto("/") and let client-side useEffect redirect to /app.
 */
async function loginAndGoToApp(page: import("@playwright/test").Page) {
	await page.goto("/");
	await page.evaluate(() => {
		localStorage.setItem("finance:auth", "true");
		localStorage.setItem("finance:user-id", "test-user-id");
		localStorage.setItem("finance:user-name", "Test User");
		localStorage.setItem("finance:user-email", "user@email.com");
		localStorage.setItem("finance:token", "test-token");
	});
	await page.goto("/");
	await expect(page).toHaveURL("/app");
}

test.describe("Dashboard (authenticated)", () => {
	test.beforeEach(async ({ page }) => {
		await loginAndGoToApp(page);
	});

	test("shows dashboard summary cards after login", async ({ page }) => {
		await expect(page.getByText("Saldo total")).toBeVisible();
		await expect(page.getByText("Receitas do mês")).toBeVisible();
		await expect(page.getByText("Despesas do mês")).toBeVisible();
	});

	test("navigates between dashboard pages via header nav", async ({ page }) => {
		const dashboardLink = page.getByRole("link", {
			name: "Dashboard",
			exact: true,
		});
		const transacoesLink = page.getByRole("link", { name: "Transações" });
		const categoriasLink = page.getByRole("link", { name: "Categorias" });

		await expect(page).toHaveURL("/app");

		await transacoesLink.click();
		await expect(page).toHaveURL("/app/transacoes");

		await categoriasLink.click();
		await expect(page).toHaveURL("/app/categorias");

		await dashboardLink.click();
		await expect(page).toHaveURL("/app");
	});

	test("highlights active nav link", async ({ page }) => {
		const dashboardLink = page.getByRole("link", {
			name: "Dashboard",
			exact: true,
		});
		const transacoesLink = page.getByRole("link", { name: "Transações" });

		await expect(dashboardLink).toHaveClass(/font-semibold/);
		await expect(transacoesLink).not.toHaveClass(/font-semibold/);

		await transacoesLink.click();
		await expect(page).toHaveURL("/app/transacoes");

		await expect(transacoesLink).toHaveClass(/font-semibold/);
		await expect(dashboardLink).not.toHaveClass(/font-semibold/);
	});

	test("renders the app header with user avatar and menu", async ({ page }) => {
		const userButton = page.getByRole("button", { name: "TU" });
		await expect(userButton).toBeVisible();

		await userButton.click();

		await expect(page.getByText("Test User", { exact: true })).toBeVisible();
		await expect(page.getByText("user@email.com")).toBeVisible();
		await expect(
			page.getByRole("menuitem", { name: "Sign out" }),
		).toBeVisible();
	});

	test("shows the app logo linked to dashboard", async ({ page }) => {
		const logoLink = page.getByRole("link", { name: "Dashboard home" });
		await expect(logoLink).toBeVisible();
	});
});
