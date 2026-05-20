import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Field, FieldType } from "./field";

describe("Field", () => {
	it("renders a label when the label prop is provided", () => {
		render(<Field label="Username">child</Field>);

		expect(screen.getByText("Username")).toBeInTheDocument();
	});

	it("does not render a label when the label prop is omitted", () => {
		render(<Field>child</Field>);

		expect(screen.queryByText("Username")).not.toBeInTheDocument();
	});

	it("renders helper text when the helper prop is provided", () => {
		render(<Field helper="This is a hint">child</Field>);

		expect(screen.getByText("This is a hint")).toBeInTheDocument();
	});

	it("does not render helper text when the helper prop is omitted", () => {
		render(<Field>child</Field>);

		expect(screen.queryByText("This is a hint")).not.toBeInTheDocument();
	});

	it("renders children inside the input wrapper", () => {
		render(
			<Field>
				<span data-testid="child">Hello</span>
			</Field>,
		);

		expect(screen.getByTestId("child")).toBeInTheDocument();
	});

	it("renders the Mail icon when type is FieldType.email", () => {
		const { container } = render(
			<Field type={FieldType.email}>child</Field>,
		);

		const iconSpan = container.querySelector(
			'span[class*="absolute"][class*="left-2"]',
		);

		expect(iconSpan).toBeInTheDocument();
		expect(iconSpan?.querySelector("svg")).toBeInTheDocument();
	});

	it("renders the User icon when type is FieldType.user", () => {
		const { container } = render(
			<Field type={FieldType.user}>child</Field>,
		);

		const iconSpan = container.querySelector(
			'span[class*="absolute"][class*="left-2"]',
		);

		expect(iconSpan).toBeInTheDocument();
		expect(iconSpan?.querySelector("svg")).toBeInTheDocument();
	});

	it("renders no icon when type is FieldType.text", () => {
		const { container } = render(
			<Field type={FieldType.text}>child</Field>,
		);

		const iconSpan = container.querySelector(
			'span[class*="absolute"][class*="left-2"]',
		);

		expect(iconSpan).not.toBeInTheDocument();
	});

	it("renders no icon when type is omitted", () => {
		const { container } = render(<Field>child</Field>);

		const iconSpan = container.querySelector(
			'span[class*="absolute"][class*="left-2"]',
		);

		expect(iconSpan).not.toBeInTheDocument();
	});

	it("applies custom className to the wrapper div", () => {
		const { container } = render(
			<Field className="custom-class">child</Field>,
		);

		const wrapper = container.firstElementChild;

		expect(wrapper).toHaveClass("custom-class");
	});
});
