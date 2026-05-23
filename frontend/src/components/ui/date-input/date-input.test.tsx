import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { DateInput } from "./index";

describe("DateInput", () => {
  it("renders an input element", () => {
    render(<DateInput />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("forwards ref to the inner input", () => {
    const ref = createRef<HTMLInputElement>();

    render(<DateInput ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("displays the given value formatted as DD/MM/AAAA", () => {
    render(<DateInput value="15/05/2026" />);

    expect(screen.getByRole("textbox")).toHaveValue("15/05/2026");
  });

  it("renders label via Field", () => {
    render(<DateInput label="Data" />);

    expect(screen.getByText("Data")).toBeInTheDocument();
  });

  it("renders helper via Field", () => {
    render(<DateInput helper="Formato: DD/MM/AAAA" />);

    expect(screen.getByText("Formato: DD/MM/AAAA")).toBeInTheDocument();
  });

  it("passes through the placeholder attribute", () => {
    render(<DateInput placeholder="DD/MM/AAAA" />);

    expect(screen.getByPlaceholderText("DD/MM/AAAA")).toBeInTheDocument();
  });

  it("sets inputMode to numeric on the inner input", () => {
    render(<DateInput />);

    expect(screen.getByRole("textbox")).toHaveAttribute("inputMode", "numeric");
  });

  it("masks digits as user types into DD/MM/AAAA format", async () => {
    const user = userEvent.setup();

    function TestWrapper() {
      const [value, setValue] = useState("");

      return <DateInput value={value} onChange={setValue} />;
    }

    render(<TestWrapper />);

    const input = screen.getByRole("textbox");

    await user.type(input, "15052026");

    expect(input).toHaveValue("15/05/2026");
  });

  it("calls onChange with the masked value as user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function TestWrapper() {
      const [value, setValue] = useState("");

      return (
        <DateInput
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
    await user.type(input, "1505");

    expect(onChange).toHaveBeenLastCalledWith("15/05");
  });

  it("ignores non-digit characters", async () => {
    const user = userEvent.setup();

    function TestWrapper() {
      const [value, setValue] = useState("");

      return <DateInput value={value} onChange={setValue} />;
    }

    render(<TestWrapper />);

    const input = screen.getByRole("textbox");
    await user.type(input, "1a/b5-0c5");

    expect(input).toHaveValue("15/05");
  });

  it("limits to 8 digits", async () => {
    const user = userEvent.setup();

    function TestWrapper() {
      const [value, setValue] = useState("");

      return <DateInput value={value} onChange={setValue} />;
    }

    render(<TestWrapper />);

    const input = screen.getByRole("textbox");
    await user.type(input, "15052026123");

    expect(input).toHaveValue("15/05/2026");
  });

  it("renders empty string when value is undefined", () => {
    render(<DateInput />);

    expect(screen.getByRole("textbox")).toHaveValue("");
  });
});
