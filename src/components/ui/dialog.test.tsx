import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

describe("Dialog", () => {
	describe("DialogTrigger", () => {
		it("renders the trigger element", () => {
			render(
				<Dialog>
					<DialogTrigger>Abrir</DialogTrigger>

					<DialogContent>
						<p>Conteúdo</p>
					</DialogContent>
				</Dialog>,
			);

			const trigger = screen.getByText("Abrir");

			expect(trigger).toBeInTheDocument();
		});

		it("opens the dialog when clicked", async () => {
			const user = userEvent.setup();

			render(
				<Dialog>
					<DialogTrigger>Abrir</DialogTrigger>

					<DialogContent>
						<p>Conteúdo</p>
					</DialogContent>
				</Dialog>,
			);

			await user.click(screen.getByText("Abrir"));

			expect(screen.getByRole("dialog")).toBeInTheDocument();
		});
	});

	describe("DialogOverlay", () => {
		it("renders the overlay when dialog is open", () => {
			render(
				<Dialog open>
					<DialogContent>
						<p>Conteúdo</p>
					</DialogContent>
				</Dialog>,
			);

			const overlay = document.querySelector<HTMLElement>(
				"[data-state='open'].fixed.inset-0",
			);

			expect(overlay).toBeInTheDocument();
			expect(overlay?.className).toContain("bg-black/80");
		});
	});

	describe("DialogContent", () => {
		it("renders content when dialog is open", () => {
			render(
				<Dialog open>
					<DialogContent>
						<p>Conteúdo do modal</p>
					</DialogContent>
				</Dialog>,
			);

			expect(screen.getByText("Conteúdo do modal")).toBeInTheDocument();
		});

		it("has data-slot attribute set to dialog-content", () => {
			render(
				<Dialog open>
					<DialogContent>
						<p>Conteúdo</p>
					</DialogContent>
				</Dialog>,
			);

			const content = screen.getByRole("dialog");

			expect(content).toHaveAttribute("data-slot", "dialog-content");
		});

		it("renders children content", () => {
			render(
				<Dialog open>
					<DialogContent>
						<label htmlFor="desc">Descrição</label>
						<input id="desc" placeholder="Ex. Almoço" />
					</DialogContent>
				</Dialog>,
			);

			expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
			expect(screen.getByPlaceholderText("Ex. Almoço")).toBeInTheDocument();
		});

		it("merges custom className", () => {
			render(
				<Dialog open>
					<DialogContent className="my-custom-class">
						<p>Conteúdo</p>
					</DialogContent>
				</Dialog>,
			);

			const content = screen.getByRole("dialog");

			expect(content.className).toContain("my-custom-class");
		});

		it("renders a native close button with X icon positioned absolute", () => {
			render(
				<Dialog open>
					<DialogContent>
						<p>Conteúdo</p>
					</DialogContent>
				</Dialog>,
			);

			const closeButton = screen.getByRole("button", { name: "Close" });

			expect(closeButton).toBeInTheDocument();
			expect(closeButton.className).toContain("absolute");
			expect(closeButton.className).toContain("right-4");
			expect(closeButton.className).toContain("top-4");
			expect(closeButton.querySelector("svg")).toBeInTheDocument();
		});
	});

	describe("DialogHeader", () => {
		it("renders as a div element", () => {
			render(<DialogHeader data-testid="header" />);

			const header = screen.getByTestId("header");

			expect(header).toBeInTheDocument();
			expect(header.tagName).toBe("DIV");
		});

		it("renders children when no title prop", () => {
			render(
				<DialogHeader>
					<h2>Meu título</h2>
				</DialogHeader>,
			);

			expect(screen.getByText("Meu título")).toBeInTheDocument();
		});

		it("renders the title text when title prop is provided", () => {
			render(
				<Dialog open>
					<DialogContent>
						<DialogHeader title="Nova transação" />
						<p>Conteúdo</p>
					</DialogContent>
				</Dialog>,
			);

			expect(screen.getByText("Nova transação")).toBeInTheDocument();
		});

		it("renders the description text when description prop is provided", () => {
			render(
				<Dialog open>
					<DialogContent>
						<DialogHeader
							title="Nova transação"
							description="Registre sua despesa ou receita"
						/>
						<p>Conteúdo</p>
					</DialogContent>
				</Dialog>,
			);

			expect(
				screen.getByText("Registre sua despesa ou receita"),
			).toBeInTheDocument();
		});

		it("does not render a title heading when title prop is omitted", () => {
			render(
				<Dialog open>
					<DialogContent>
						<DialogHeader />
						<p>Conteúdo</p>
					</DialogContent>
				</Dialog>,
			);

			expect(
				screen.queryByRole("heading", { level: 2 }),
			).not.toBeInTheDocument();
		});

		it("renders just the title and description with no close button inside header", () => {
			render(
				<Dialog open>
					<DialogContent>
						<DialogHeader title="Nova transação" />
						<p>Conteúdo</p>
					</DialogContent>
				</Dialog>,
			);

			const header = screen
				.getByText("Nova transação")
				.closest("[data-slot='dialog-header']");

			expect(header).toBeInTheDocument();

			const buttonsInside = header?.querySelectorAll("button");

			expect(buttonsInside).toHaveLength(0);
		});
	});

	describe("DialogFooter", () => {
		it("renders as a div element", () => {
			render(<DialogFooter data-testid="footer">Footer content</DialogFooter>);

			const footer = screen.getByTestId("footer");

			expect(footer).toBeInTheDocument();
			expect(footer.tagName).toBe("DIV");
		});

		it("renders children content", () => {
			render(
				<DialogFooter>
					<button type="button">Salvar</button>
				</DialogFooter>,
			);

			expect(
				screen.getByRole("button", { name: "Salvar" }),
			).toBeInTheDocument();
		});
	});

	describe("DialogTitle", () => {
		it("renders as a heading element", () => {
			render(
				<Dialog open>
					<DialogContent>
						<DialogTitle>Meu Título</DialogTitle>
					</DialogContent>
				</Dialog>,
			);

			const title = screen.getByText("Meu Título");

			expect(title).toBeInTheDocument();
		});
	});

	describe("DialogDescription", () => {
		it("renders the description text", () => {
			render(
				<Dialog open>
					<DialogContent>
						<DialogDescription>Minha descrição</DialogDescription>
					</DialogContent>
				</Dialog>,
			);

			expect(screen.getByText("Minha descrição")).toBeInTheDocument();
		});
	});

	describe("DialogClose", () => {
		it("renders a button that closes the dialog", async () => {
			const user = userEvent.setup();

			render(
				<Dialog open>
					<DialogContent>
						<DialogHeader title="Nova transação" />
						<p>Conteúdo</p>
						<DialogClose>Cancelar</DialogClose>
					</DialogContent>
				</Dialog>,
			);

			const cancelButton = screen.getByText("Cancelar");

			expect(cancelButton).toBeInTheDocument();

			await user.click(cancelButton);
		});
	});
});
