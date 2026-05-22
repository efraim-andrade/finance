import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Tag } from "./index";

describe("Tag", () => {
	it("renders a span element", () => {
		render(<Tag>Label</Tag>);

		const tag = screen.getByText("Label");

		expect(tag).toBeInTheDocument();
		expect(tag.tagName).toBe("SPAN");
	});

	it("renders children text", () => {
		render(<Tag>Income</Tag>);

		expect(screen.getByText("Income")).toBeInTheDocument();
	});

	it("has data-slot attribute set to tag", () => {
		render(<Tag>Label</Tag>);

		const tag = screen.getByText("Label");

		expect(tag).toHaveAttribute("data-slot", "tag");
	});

	it("uses gray variant by default", () => {
		render(<Tag>Label</Tag>);

		const tag = screen.getByText("Label");

		expect(tag).toHaveAttribute("data-variant", "gray");
		expect(tag.className).toContain("bg-gray-200");
		expect(tag.className).toContain("text-gray-700");
	});

	it("renders with blue variant", () => {
		render(<Tag variant="blue">Blue</Tag>);

		const tag = screen.getByText("Blue");

		expect(tag).toHaveAttribute("data-variant", "blue");
		expect(tag.className).toContain("bg-blue-light");
		expect(tag.className).toContain("text-blue-dark");
	});

	it("renders with purple variant", () => {
		render(<Tag variant="purple">Purple</Tag>);

		const tag = screen.getByText("Purple");

		expect(tag.className).toContain("bg-purple-light");
	});

	it("renders with pink variant", () => {
		render(<Tag variant="pink">Pink</Tag>);

		const tag = screen.getByText("Pink");

		expect(tag.className).toContain("bg-pink-light");
	});

	it("renders with red variant", () => {
		render(<Tag variant="red">Red</Tag>);

		const tag = screen.getByText("Red");

		expect(tag.className).toContain("bg-red-light");
	});

	it("renders with orange variant", () => {
		render(<Tag variant="orange">Orange</Tag>);

		const tag = screen.getByText("Orange");

		expect(tag.className).toContain("bg-orange-light");
	});

	it("renders with yellow variant", () => {
		render(<Tag variant="yellow">Yellow</Tag>);

		const tag = screen.getByText("Yellow");

		expect(tag.className).toContain("bg-yellow-light");
	});

	it("renders with green variant", () => {
		render(<Tag variant="green">Green</Tag>);

		const tag = screen.getByText("Green");

		expect(tag.className).toContain("bg-green-light");
	});

	it("has rounded-full shape", () => {
		render(<Tag>Label</Tag>);

		const tag = screen.getByText("Label");

		expect(tag.className).toContain("rounded-full");
	});

	it("merges custom className", () => {
		render(<Tag className="my-class">Label</Tag>);

		const tag = screen.getByText("Label");

		expect(tag.className).toContain("my-class");
	});

	it("forwards additional HTML attributes", () => {
		render(<Tag id="tag-id" data-ref="test">Label</Tag>);

		const tag = screen.getByText("Label");

		expect(tag).toHaveAttribute("id", "tag-id");
		expect(tag).toHaveAttribute("data-ref", "test");
	});
});
