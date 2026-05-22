import { render, screen } from "@testing-library/react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { describe, expect, it } from "vitest";

import { SummaryCard } from "./index";

describe("SummaryCard", () => {
  it("renders the value text", () => {
    render(
      <SummaryCard
        icon={ArrowUp}
        iconColor="text-green-dark"
        label="Receitas"
        value="R$ 1.500,00"
      />,
    );

    expect(screen.getByText("R$ 1.500,00")).toBeInTheDocument();
  });

  it("renders the label text", () => {
    render(
      <SummaryCard
        icon={ArrowUp}
        iconColor="text-green-dark"
        label="Receitas do mês"
        value="R$ 1.500,00"
      />,
    );

    expect(screen.getByText("Receitas do mês")).toBeInTheDocument();
  });

  it("renders the icon as an SVG element", () => {
    const { container } = render(
      <SummaryCard
        icon={ArrowUp}
        iconColor="text-green-dark"
        label="Receitas"
        value="R$ 1.500,00"
      />,
    );

    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
  });

  it("has data-slot attribute set to summary-card", () => {
    const { container } = render(
      <SummaryCard
        icon={ArrowUp}
        iconColor="text-green-dark"
        label="Receitas"
        value="R$ 1.500,00"
      />,
    );

    const card = container.querySelector('[data-slot="summary-card"]');

    expect(card).toBeInTheDocument();
  });

  it("applies the iconColor class to the SVG element", () => {
    const { container } = render(
      <SummaryCard
        icon={ArrowUp}
        iconColor="text-green-dark"
        label="Receitas"
        value="R$ 1.500,00"
      />,
    );

    const svg = container.querySelector("svg");

    expect(svg).toHaveClass("text-green-dark");
  });

  it("applies a different iconColor class", () => {
    const { container } = render(
      <SummaryCard
        icon={ArrowDown}
        iconColor="text-red-dark"
        label="Despesas"
        value="R$ 800,00"
      />,
    );

    const svg = container.querySelector("svg");

    expect(svg).toHaveClass("text-red-dark");
  });

  it("renders the value inside a paragraph element", () => {
    render(
      <SummaryCard
        icon={ArrowUp}
        iconColor="text-green-dark"
        label="Receitas"
        value="R$ 1.500,00"
      />,
    );

    const value = screen.getByText("R$ 1.500,00");

    expect(value.tagName).toBe("P");
  });

  it("renders the label inside a span element", () => {
    render(
      <SummaryCard
        icon={ArrowUp}
        iconColor="text-green-dark"
        label="Receitas"
        value="R$ 1.500,00"
      />,
    );

    const label = screen.getByText("Receitas");

    expect(label.tagName).toBe("SPAN");
  });

  it("renders with a long formatted currency value", () => {
    render(
      <SummaryCard
        icon={ArrowDown}
        iconColor="text-red-dark"
        label="Despesas"
        value="R$ 99.999.999,99"
      />,
    );

    expect(screen.getByText("R$ 99.999.999,99")).toBeInTheDocument();
  });
});
