import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Link } from "./index";

describe("Link", () => {
	it("renders an anchor element by default", () => {
		render(<Link href="/test">Click me</Link>);

		const link = screen.getByRole("link");

		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/test");
	});

	it("renders children text", () => {
		render(<Link href="/test">Click me</Link>);

		expect(screen.getByText("Click me")).toBeInTheDocument();
	});

	it("has data-slot attribute set to link", () => {
		render(<Link href="/test">Link</Link>);

		const link = screen.getByRole("link");

		expect(link).toHaveAttribute("data-slot", "link");
	});

	it("uses hover underline by default", () => {
		render(<Link href="/test">Link</Link>);

		const link = screen.getByRole("link");

		expect(link).toHaveAttribute("data-underline", "hover");
		expect(link.className).toContain("hover:border-b");
	});

	it("renders with always underline", () => {
		render(
			<Link href="/test" underline="always">
				Link
			</Link>,
		);

		const link = screen.getByRole("link");

		expect(link).toHaveAttribute("data-underline", "always");
		expect(link.className).toContain("underline");
	});

	it("renders with never underline", () => {
		render(
			<Link href="/test" underline="never">
				Link
			</Link>,
		);

		const link = screen.getByRole("link");

		expect(link).toHaveAttribute("data-underline", "never");
		expect(link.className).toContain("no-underline");
	});

	it("has brand-base text color", () => {
		render(<Link href="/test">Link</Link>);

		const link = screen.getByRole("link");

		expect(link.className).toContain("text-brand-base");
	});

	it("forwards the target attribute", () => {
		render(
			<Link href="/test" target="_blank">
				Link
			</Link>,
		);

		const link = screen.getByRole("link");

		expect(link).toHaveAttribute("target", "_blank");
	});

	it("passes additional HTML attributes through", () => {
		render(
			<Link href="/test" aria-label="Go home">
				Home
			</Link>,
		);

		const link = screen.getByRole("link", { name: "Go home" });

		expect(link).toBeInTheDocument();
	});

	describe("when asChild is true", () => {
		it("renders the child element instead of an anchor", () => {
			render(
				<Link asChild>
					<button type="button">Clickable</button>
				</Link>,
			);

			const button = screen.getByRole("button");

			expect(button).toBeInTheDocument();
			expect(screen.queryByRole("link")).not.toBeInTheDocument();
		});
	});

	it("merges custom className", () => {
		render(
			<Link href="/test" className="my-class">
				Link
			</Link>,
		);

		const link = screen.getByRole("link");

		expect(link.className).toContain("my-class");
	});
});
