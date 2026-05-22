import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TransactionType } from "./index";

describe("TransactionType", () => {
	it("renders a span element", () => {
		render(<TransactionType>Entrada</TransactionType>);

		const el = screen.getByText("Entrada");

		expect(el).toBeInTheDocument();
		expect(el.tagName).toBe("SPAN");
	});

	it("renders children text", () => {
		render(<TransactionType>Saída</TransactionType>);

		expect(screen.getByText("Saída")).toBeInTheDocument();
	});

	it("has data-slot attribute set to transaction-type", () => {
		render(<TransactionType>Entrada</TransactionType>);

		const el = screen.getByText("Entrada");

		expect(el).toHaveAttribute("data-slot", "transaction-type");
	});

	it("uses income variant by default", () => {
		render(<TransactionType>Entrada</TransactionType>);

		const el = screen.getByText("Entrada");

		expect(el).toHaveAttribute("data-variant", "income");
		expect(el.className).toContain("text-green-dark");
	});

	it("renders an up arrow icon for income", () => {
		const { container } = render(<TransactionType>Entrada</TransactionType>);

		const svg = container.querySelector("svg");

		expect(svg).toBeInTheDocument();
	});

	it("renders with expense variant", () => {
		render(<TransactionType variant="expense">Saída</TransactionType>);

		const el = screen.getByText("Saída");

		expect(el).toHaveAttribute("data-variant", "expense");
		expect(el.className).toContain("text-red-dark");
	});

	it("renders a down arrow icon for expense", () => {
		const { container } = render(
			<TransactionType variant="expense">Saída</TransactionType>,
		);

		const svg = container.querySelector("svg");

		expect(svg).toBeInTheDocument();
	});

	it("has gap between icon and text", () => {
		render(<TransactionType>Entrada</TransactionType>);

		const el = screen.getByText("Entrada");

		expect(el.className).toContain("gap-2");
	});

	it("merges custom className", () => {
		render(<TransactionType className="my-class">Entrada</TransactionType>);

		const el = screen.getByText("Entrada");

		expect(el.className).toContain("my-class");
	});
});
