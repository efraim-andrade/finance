import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Trash } from "lucide-react";

import { IconButton } from "./index";

describe("IconButton", () => {
	it("renders a button element", () => {
		render(<IconButton aria-label="Delete"><Trash /></IconButton>);

		const button = screen.getByRole("button");

		expect(button).toBeInTheDocument();
	});

	it("renders children (icon)", () => {
		render(<IconButton aria-label="Delete"><Trash /></IconButton>);

		const button = screen.getByRole("button");

		expect(button.querySelector("svg")).toBeInTheDocument();
	});

	it("has data-slot attribute set to icon-button", () => {
		render(<IconButton aria-label="Delete"><Trash /></IconButton>);

		const button = screen.getByRole("button");

		expect(button).toHaveAttribute("data-slot", "icon-button");
	});

	it("uses outline variant by default", () => {
		render(<IconButton aria-label="Delete"><Trash /></IconButton>);

		const button = screen.getByRole("button");

		expect(button).toHaveAttribute("data-variant", "outline");
	});

	it("renders with outline variant classes", () => {
		render(<IconButton aria-label="Delete"><Trash /></IconButton>);

		const button = screen.getByRole("button");

		expect(button.className).toContain("border-input");
	});

	it("renders with danger variant", () => {
		render(<IconButton variant="danger" aria-label="Delete"><Trash /></IconButton>);

		const button = screen.getByRole("button");

		expect(button).toHaveAttribute("data-variant", "danger");
		expect(button.className).toContain("text-red-base");
	});

	it("is 32x32 (size-8)", () => {
		render(<IconButton aria-label="Delete"><Trash /></IconButton>);

		const button = screen.getByRole("button");

		expect(button.className).toContain("size-8");
	});

	it("forwards aria-label to the button", () => {
		render(<IconButton aria-label="Edit item"><Trash /></IconButton>);

		const button = screen.getByRole("button", { name: "Edit item" });

		expect(button).toBeInTheDocument();
	});

	it("applies disabled attribute and styling", () => {
		render(<IconButton disabled aria-label="Delete"><Trash /></IconButton>);

		const button = screen.getByRole("button");

		expect(button).toBeDisabled();
		expect(button.className).toContain("disabled:opacity-50");
	});

	it("merges custom className", () => {
		render(<IconButton className="my-custom" aria-label="Delete"><Trash /></IconButton>);

		const button = screen.getByRole("button");

		expect(button.className).toContain("my-custom");
	});
});
