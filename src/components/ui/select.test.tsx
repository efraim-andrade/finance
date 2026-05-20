import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
	Select,
	SelectGroup,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
} from "./select";

describe("Select", () => {
	it("renders SelectTrigger with a ChevronDown icon", () => {
		const { container } = render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Pick one" />
				</SelectTrigger>
			</Select>,
		);

		const trigger = screen.getByRole("combobox");

		expect(trigger).toBeInTheDocument();

		const svg = container.querySelector("svg");

		expect(svg).toBeInTheDocument();
	});

	it("shows a Check icon inside a selected SelectItem", () => {
		render(
			<Select defaultOpen value="a">
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">Option A</SelectItem>
				</SelectContent>
			</Select>,
		);

		const item = document.querySelector('[data-state="checked"]');

		expect(item).toBeInTheDocument();
	});

	it("renders SelectContent inside a portal", () => {
		render(
			<Select defaultOpen>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">Option A</SelectItem>
				</SelectContent>
			</Select>,
		);

		expect(screen.getByText("Option A")).toBeInTheDocument();
	});

	it("renders SelectLabel with its children", () => {
		render(
			<Select defaultOpen>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Fruits</SelectLabel>
						<SelectItem value="apple">Apple</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>,
		);

		expect(screen.getByText("Fruits")).toBeInTheDocument();
	});

	it("renders SelectSeparator", () => {
		render(
			<Select defaultOpen>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
					<SelectSeparator />
					<SelectItem value="b">B</SelectItem>
				</SelectContent>
			</Select>,
		);

		expect(screen.getByText("A")).toBeInTheDocument();
		expect(screen.getByText("B")).toBeInTheDocument();
	});

	it("renders SelectScrollUpButton with ChevronUp icon", () => {
		const { container } = render(
			<Select defaultOpen>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectScrollUpButton />
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);

		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders SelectScrollDownButton with ChevronDown icon", () => {
		const { container } = render(
			<Select defaultOpen>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
					<SelectScrollDownButton />
				</SelectContent>
			</Select>,
		);

		expect(container.querySelector("svg")).toBeInTheDocument();
	});
});
