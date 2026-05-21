import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/landing");
	});

	test("renders hero section with title and subtitle", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: /Controle suas finanças/ }),
		).toBeVisible();

		await expect(
			page.getByText(/Organize seus gastos, acompanhe suas receitas/),
		).toBeVisible();
	});

	test("renders header with login and signup links", async ({ page }) => {
		const header = page.locator("header");

		await expect(header.getByRole("link", { name: "Login" })).toBeVisible();
		await expect(
			header.getByRole("link", { name: "Começar Grátis" }),
		).toBeVisible();
	});

	test("renders hero CTA buttons", async ({ page }) => {
		// "Começar Grátis" exists in both header and hero — check the first one
		const heroSection = page.locator("section").first();
		await expect(
			heroSection.getByRole("button", { name: "Ver Demonstração" }),
		).toBeVisible();
	});

	test("renders features section", async ({ page }) => {
		await expect(
			page.getByText("Dashboard Financeiro"),
		).toBeVisible();
		await expect(
			page.getByText("Controle de Transações"),
		).toBeVisible();
		await expect(
			page.getByText("Categorias Inteligentes"),
		).toBeVisible();
	});

	test("renders benefits section", async ({ page }) => {
		await expect(
			page.getByText("Por que escolher a Finance?"),
		).toBeVisible();
		await expect(page.getByText("100% Gratuito")).toBeVisible();
		await expect(page.getByText("Dados Seguros")).toBeVisible();
		await expect(page.getByText("Interface Simples")).toBeVisible();
	});

	test("renders CTA section with heading and action button", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "Pronto para começar?" }),
		).toBeVisible();

		await expect(
			page.getByRole("button", { name: "Criar Conta Grátis" }),
		).toBeVisible();
	});

	test("renders footer with product, company, and social links", async ({ page }) => {
		const footer = page.locator("footer");

		await expect(footer).toBeVisible();
		await expect(footer.getByText("Produto")).toBeVisible();
		await expect(footer.getByText("Empresa")).toBeVisible();
		await expect(footer.getByText("Redes")).toBeVisible();
		await expect(footer.getByText("Recursos")).toBeVisible();
		await expect(footer.getByText("Sobre")).toBeVisible();
		await expect(footer.getByText("Twitter")).toBeVisible();

		await expect(
			footer.getByText("© 2026 Finance. Todos os direitos reservados."),
		).toBeVisible();
	});

	test("header Login link navigates to home", async ({ page }) => {
		const header = page.locator("header");
		await header.getByRole("link", { name: "Login" }).click();

		await expect(page).toHaveURL("/");
	});

	test("hero Começar Grátis link navigates to signup", async ({ page }) => {
		// The header "Começar Grátis" is inside a <Link to="/criar-conta">
		await page.getByRole("link", { name: "Começar Grátis" }).first().click();

		await expect(page).toHaveURL("/criar-conta");
	});
});
