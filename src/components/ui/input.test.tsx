import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

	describe("when type is password", () => {
		it("keeps native input type as password initially", () => {
			render(<Input type={FieldType.password} placeholder="Senha" />);

			const input = screen.getByPlaceholderText("Senha");

			expect(input).toHaveAttribute("type", "password");
		});

		it("applies pr-8 class to the input", () => {
			const { container } = render(<Input type={FieldType.password} />);

			expect(container.querySelector("input")?.className).toContain("pr-8");
		});

		it("renders a button to toggle visibility", () => {
			render(<Input type={FieldType.password} />);

			expect(
				screen.getByRole("button", { name: "Show password" }),
			).toBeInTheDocument();
		});

		it("does not render the toggle button for email type", () => {
			render(<Input type={FieldType.email} />);

			expect(screen.queryByRole("button")).not.toBeInTheDocument();
		});

		it("does not render the toggle button for text type", () => {
			render(<Input type={FieldType.text} />);

			expect(screen.queryByRole("button")).not.toBeInTheDocument();
		});

		it("does not render the toggle button for user type", () => {
			render(<Input type={FieldType.user} />);

			expect(screen.queryByRole("button")).not.toBeInTheDocument();
		});

		it("reveals password when toggle button is clicked", async () => {
			const user = userEvent.setup();

			render(<Input type={FieldType.password} placeholder="Digite" />);

			await user.click(screen.getByRole("button", { name: "Show password" }));

			const input = screen.getByPlaceholderText("Digite");

			expect(input).toHaveAttribute("type", "text");
			expect(
				screen.getByRole("button", { name: "Hide password" }),
			).toBeInTheDocument();
		});

		it("hides password when toggle button is clicked again", async () => {
			const user = userEvent.setup();

			render(<Input type={FieldType.password} placeholder="Digite" />);

			const button = screen.getByRole("button", {
				name: "Show password",
			});

			await user.click(button);
			await user.click(screen.getByRole("button", { name: "Hide password" }));

			const input = screen.getByPlaceholderText("Digite");

			expect(input).toHaveAttribute("type", "password");
			expect(
				screen.getByRole("button", { name: "Show password" }),
			).toBeInTheDocument();
		});
	});
});
