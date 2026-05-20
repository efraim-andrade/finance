import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { FieldType } from "./field";
import { Input } from "./input";

describe("Input", () => {
	it("renders an <input> element", () => {
		render(<Input />);

		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("forwards ref to the inner <input>", () => {
		const ref = createRef<HTMLInputElement>();

		render(<Input ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLInputElement);
	});

	it("passes the type attribute to the inner <input>", () => {
		render(<Input type={FieldType.email} />);

		const input = screen.getByRole("textbox");

		expect(input).toHaveAttribute("type", "email");
	});

	it("applies pl-8 when type is FieldType.email", () => {
		render(<Input type={FieldType.email} />);

		const input = screen.getByRole("textbox");

		expect(input.className).toContain("pl-8");
		expect(input.className).not.toContain("pl-3");
	});

	it("applies pl-8 when type is FieldType.user", () => {
		render(<Input type={FieldType.user} />);

		const input = screen.getByRole("textbox");

		expect(input.className).toContain("pl-8");
		expect(input.className).not.toContain("pl-3");
	});

	it("applies pl-3 when type is FieldType.text", () => {
		render(<Input type={FieldType.text} />);

		const input = screen.getByRole("textbox");

		expect(input.className).toContain("pl-3");
		expect(input.className).not.toContain("pl-8");
	});

	it("applies pl-3 when type is omitted", () => {
		render(<Input />);

		const input = screen.getByRole("textbox");

		expect(input.className).toContain("pl-3");
		expect(input.className).not.toContain("pl-8");
	});

	it("passes through the placeholder attribute", () => {
		render(<Input placeholder="Enter name" />);

		const input = screen.getByPlaceholderText("Enter name");

		expect(input).toBeInTheDocument();
	});

	it("delegates label rendering to Field", () => {
		render(<Input label="Email" />);

		expect(screen.getByText("Email")).toBeInTheDocument();
	});

	it("delegates helper rendering to Field", () => {
		render(<Input helper="Required field" />);

		expect(screen.getByText("Required field")).toBeInTheDocument();
	});
});
