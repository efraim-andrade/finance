import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageHeader } from "./index";

describe("PageHeader", () => {
  it("renders the title text", () => {
    render(
      <PageHeader title="Transações" description="Gerencie suas transações" />,
    );

    expect(screen.getByText("Transações")).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(
      <PageHeader
        title="Categorias"
        description="Organize suas transações por categorias"
      />,
    );

    expect(
      screen.getByText("Organize suas transações por categorias"),
    ).toBeInTheDocument();
  });

  it("renders title inside an h1 element", () => {
    render(
      <PageHeader title="Transações" description="Gerencie suas transações" />,
    );

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toHaveTextContent("Transações");
  });

  it("renders description inside a paragraph element", () => {
    render(
      <PageHeader title="Transações" description="Gerencie suas transações" />,
    );

    const description = screen.getByText("Gerencie suas transações");

    expect(description.tagName).toBe("P");
  });

  it("renders the action slot when provided", () => {
    render(
      <PageHeader
        title="Transações"
        description="Gerencie suas transações"
        action={<button type="button">Nova transação</button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Nova transação" }),
    ).toBeInTheDocument();
  });

  it("does not render an action when none is provided", () => {
    const { container } = render(
      <PageHeader title="Transações" description="Gerencie suas transações" />,
    );

    const buttons = container.querySelectorAll("button");

    expect(buttons).toHaveLength(0);
  });

  it("renders with a long title without breaking", () => {
    render(
      <PageHeader
        title="Receitas e Despesas do Mês de Janeiro"
        description="Acompanhe todas as suas transações financeiras do período"
      />,
    );

    expect(
      screen.getByText("Receitas e Despesas do Mês de Janeiro"),
    ).toBeInTheDocument();
  });
});
