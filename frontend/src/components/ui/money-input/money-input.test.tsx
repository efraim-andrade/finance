import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { formatBRL } from "~/lib/format-brl";
import { MoneyInput } from "./index";

describe("MoneyInput", () => {
  it("renders an input element", () => {
    render(<MoneyInput />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("forwards ref to the inner input", () => {
    const ref = createRef<HTMLInputElement>();

    render(<MoneyInput ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("displays R$ 0,00 when value is 0", () => {
    render(<MoneyInput value={0} />);

    expect(screen.getByRole("textbox")).toHaveValue(formatBRL(0));
  });

  it("displays formatted BRL value for a given number", () => {
    render(<MoneyInput value={1234.56} />);

    expect(screen.getByRole("textbox")).toHaveValue(formatBRL(1234.56));
  });

  it("displays formatted BRL for large numbers", () => {
    render(<MoneyInput value={1_000_000} />);

    expect(screen.getByRole("textbox")).toHaveValue(formatBRL(1_000_000));
  });

  it("displays R$ 0,00 when value is undefined", () => {
    render(<MoneyInput />);

    expect(screen.getByRole("textbox")).toHaveValue(formatBRL(0));
  });

  it("updates display value as user types digits", async () => {
    const user = userEvent.setup();

    function TestWrapper() {
      const [value, setValue] = useState(0);

      return <MoneyInput value={value} onChange={setValue} />;
    }

    render(<TestWrapper />);

    const input = screen.getByRole("textbox");

    await user.type(input, "1234");

    expect(input).toHaveValue(formatBRL(12.34));
  });

  it("calls onChange with the correct numeric value as user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function TestWrapper() {
      const [value, setValue] = useState(0);

      return (
        <MoneyInput
          value={value}
          onChange={(v) => {
            setValue(v);
            onChange(v);
          }}
        />
      );
    }

    render(<TestWrapper />);

    const input = screen.getByRole("textbox");

    await user.type(input, "567");

    expect(onChange).toHaveBeenLastCalledWith(5.67);
  });

  it("renders label via Field", () => {
    render(<MoneyInput label="Valor" />);

    expect(screen.getByText("Valor")).toBeInTheDocument();
  });

  it("renders helper via Field", () => {
    render(<MoneyInput helper="Informe o valor" />);

    expect(screen.getByText("Informe o valor")).toBeInTheDocument();
  });

  it("passes through the placeholder attribute", () => {
    render(<MoneyInput placeholder="Digite o valor" />);

    expect(screen.getByPlaceholderText("Digite o valor")).toBeInTheDocument();
  });

  it("sets inputMode to numeric on the inner input", () => {
    render(<MoneyInput />);

    expect(screen.getByRole("textbox")).toHaveAttribute("inputMode", "numeric");
  });
});
