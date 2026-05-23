import { test, expect } from "@playwright/test";

test.describe("Password recovery page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/recuperar-senha");
	});

	test("renders the password recovery page with title and description", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "Recuperar senha" }),
		).toBeVisible();

		await expect(
			page.getByText("Receba um link de recuperação no seu e-mail"),
		).toBeVisible();
	});

	test("has a link back to the login page", async ({ page }) => {
		const backLink = page.getByRole("link", { name: "Voltar ao login" });
		await expect(backLink).toBeVisible();
		await expect(backLink).toHaveAttribute("href", "/");
	});

	test("navigates back to login page on link click", async ({ page }) => {
		await page.getByRole("link", { name: "Voltar ao login" }).click();
		await expect(page).toHaveURL("/");
	});
});
