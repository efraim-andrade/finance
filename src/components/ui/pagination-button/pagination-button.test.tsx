import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PaginationButton } from "./index";

describe("PaginationButton", () => {
	it("renders a button element", () => {
		render(<PaginationButton>1</PaginationButton>);

		const button = screen.getByRole("button");

		expect(button).toBeInTheDocument();
	});

	it("renders children text", () => {
		render(<PaginationButton>3</PaginationButton>);

		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("has data-slot attribute set to pagination-button", () => {
		render(<PaginationButton>1</PaginationButton>);

		const button = screen.getByRole("button");

		expect(button).toHaveAttribute("data-slot", "pagination-button");
	});

	it("uses default variant by default", () => {
		render(<PaginationButton>1</PaginationButton>);

		const button = screen.getByRole("button");

		expect(button).toHaveAttribute("data-variant", "default");
		expect(button.className).toContain("border-input");
		expect(button.className).toContain("text-gray-700");
	});

	it("renders with active variant", () => {
		render(<PaginationButton variant="active">2</PaginationButton>);

		const button = screen.getByRole("button");

		expect(button).toHaveAttribute("data-variant", "active");
		expect(button.className).toContain("bg-brand-base");
		expect(button.className).toContain("text-white");
	});

	it("is 32x32 (size-8)", () => {
		render(<PaginationButton>1</PaginationButton>);

		const button = screen.getByRole("button");

		expect(button.className).toContain("size-8");
	});

	it("applies disabled attribute and styling", () => {
		render(<PaginationButton disabled>1</PaginationButton>);

		const button = screen.getByRole("button");

		expect(button).toBeDisabled();
		expect(button.className).toContain("disabled:opacity-50");
	});

	it("merges custom className", () => {
		render(<PaginationButton className="my-class">1</PaginationButton>);

		const button = screen.getByRole("button");

		expect(button.className).toContain("my-class");
	});

	it("forwards additional HTML attributes", () => {
		render(<PaginationButton aria-label="Page 3">3</PaginationButton>);

		const button = screen.getByRole("button", { name: "Page 3" });

		expect(button).toBeInTheDocument();
	});

	describe("when asChild is true", () => {
		it("renders the child element instead of a button", () => {
			render(
				<PaginationButton asChild>
					<a href="/page/2">2</a>
				</PaginationButton>,
			);

			const link = screen.getByRole("link");

			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute("href", "/page/2");
		});
	});
});
