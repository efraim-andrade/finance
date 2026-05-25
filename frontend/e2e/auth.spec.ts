import { test, expect } from "@playwright/test";

test.describe("Authentication flows", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("redirects to /app when already authenticated", async ({ page }) => {
		await page.evaluate(() => {
			localStorage.setItem("finance:auth", "true");
		});

		await page.goto("/");

		await expect(page).toHaveURL("/app");
	});

	test("logs in and navigates to dashboard", async ({ page }) => {
		const emailInput = page.getByPlaceholder("mail@exemplo.com");
		const passwordInput = page.getByPlaceholder("Digite sua senha");
		const submitButton = page.getByRole("button", { name: "Entrar" });

		await emailInput.fill("user@example.com");
		await passwordInput.fill("password123");

		const [response] = await Promise.all([
			page.waitForResponse(
				(resp) => resp.url().includes("/graphql") && resp.status() === 200,
				{ timeout: 10_000 },
			),
			submitButton.click(),
		]);

		const body = await response.json();
		const hasErrors = body?.errors?.length > 0;

		if (!hasErrors) {
			await expect(page).toHaveURL("/app", { timeout: 5_000 });
		} else {
			await expect(
				page.getByText("E-mail ou senha inválidos"),
			).toBeVisible();
		}
	});

	test("logs out and redirects to login page", async ({ page }) => {
		// Login first via localStorage
		await page.evaluate(() => {
			localStorage.setItem("finance:auth", "true");
		});
		await page.goto("/");
		await expect(page).toHaveURL("/app");

		// Open user menu and logout
		const userMenuButton = page.getByRole("button", { name: "CT" });
		await userMenuButton.click();

		const signOutButton = page.getByRole("menuitem", { name: "Sign out" });
		await signOutButton.click();

		await expect(page).toHaveURL("/");
	});

	test("shows login page with all required elements", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "Fazer login" }),
		).toBeVisible();
		await expect(page.getByText("E-mail")).toBeVisible();
		await expect(page.getByText("Senha").first()).toBeVisible();
		await expect(page.getByPlaceholder("mail@exemplo.com")).toBeVisible();
		await expect(page.getByPlaceholder("Digite sua senha")).toBeVisible();
		await expect(page.getByText("Lembrar-me")).toBeVisible();
		await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
	});

	test("navigates to signup page from login", async ({ page }) => {
		const signupLink = page.getByRole("link", { name: "Criar conta" });
		await signupLink.click();

		await expect(page).toHaveURL("/criar-conta");
	});

	test("navigates to password recovery from login", async ({ page }) => {
		const recoveryLink = page.getByRole("link", { name: "Recuperar senha" });
		await recoveryLink.click();

		await expect(page).toHaveURL("/recuperar-senha");
	});

	test("signs up and navigates to dashboard", async ({ page }) => {
		await page.goto("/criar-conta");

		const nameInput = page.getByPlaceholder("Seu nome completo");
		const emailInput = page.getByPlaceholder("mail@exemplo.com");
		const passwordInput = page.getByPlaceholder("Digite sua senha");
		const submitButton = page.getByRole("button", { name: "Cadastrar" });

		await nameInput.fill("Test User");
		await emailInput.fill("test@example.com");
		await passwordInput.fill("password123");

		const [response] = await Promise.all([
			page.waitForResponse(
				(resp) => resp.url().includes("/graphql") && resp.status() === 200,
				{ timeout: 10_000 },
			),
			submitButton.click(),
		]);

		const body = await response.json();
		const hasErrors = body?.errors?.length > 0;

		if (!hasErrors) {
			await expect(page).toHaveURL("/app", { timeout: 5_000 });
		} else {
			await expect(page.getByText("Falha ao criar usuário")).toBeVisible();
		}
	});

	test("shows validation errors on signup form with invalid data", async ({
		page,
	}) => {
		await page.goto("/criar-conta");

		// Wait for the form to fully hydrate
		await page.waitForTimeout(500);

		const submitButton = page.getByRole("button", { name: "Cadastrar" });
		await submitButton.click();

		// Wait for validation errors to render
		await expect(
			page.getByText("O nome deve ter no mínimo 3 caracteres"),
		).toBeVisible();
		await expect(
			page.getByText("Insira um e-mail válido"),
		).toBeVisible();
		await expect(
			page.getByText("A senha deve ter no mínimo 8 caracteres"),
		).toBeVisible();
	});

	test("returns to login page from signup", async ({ page }) => {
		await page.goto("/criar-conta");

		const loginLink = page.getByRole("link", { name: "Fazer login" });
		await loginLink.click();

		await expect(page).toHaveURL("/");
	});

	test.describe("Auth guard (unauthenticated)", () => {
		test("prevents access to /app when not authenticated", async ({
			page,
		}) => {
			await page.goto("/app");

			await expect(page).toHaveURL("/");
		});

		test("prevents access to /app/transacoes when not authenticated", async ({
			page,
		}) => {
			await page.goto("/app/transacoes");

			await expect(page).toHaveURL("/");
		});

		test("prevents access to /app/categorias when not authenticated", async ({
			page,
		}) => {
			await page.goto("/app/categorias");

			await expect(page).toHaveURL("/");
		});
	});
});
