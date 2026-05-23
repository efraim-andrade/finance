import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Checkbox } from "./index";

describe("Checkbox", () => {
  it("renders as a checkbox role", () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeInTheDocument();
  });

  it("starts unchecked by default", () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();
  });

  it("can start checked when defaultChecked is true", () => {
    render(<Checkbox defaultChecked />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeChecked();
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<Checkbox />);

    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("calls onCheckedChange when toggled", async () => {
    const user = userEvent.setup();
    let checked = false;

    function handleChange(value: boolean) {
      checked = value;
    }

    render(<Checkbox onCheckedChange={handleChange} />);

    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);

    expect(checked).toBe(true);
  });

  it("toggles via controlled prop", async () => {
    const user = userEvent.setup();
    let checked = false;

    function handleChange(value: boolean) {
      checked = value;
    }

    const { rerender } = render(
      <Checkbox checked={checked} onCheckedChange={handleChange} />,
    );

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    rerender(<Checkbox checked={true} onCheckedChange={handleChange} />);

    expect(checkbox).toBeChecked();
  });

  it("can be disabled", () => {
    render(<Checkbox disabled />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeDisabled();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(<Checkbox disabled />);

    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("merges custom className", () => {
    render(<Checkbox className="my-custom-class" />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox.className).toContain("my-custom-class");
  });

  it("has base styles applied", () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox.className).toContain("rounded-sm");
    expect(checkbox.className).toContain("border-input");
    expect(checkbox.className).toContain("bg-background");
  });

  it("applies data-state attribute when checked", async () => {
    const user = userEvent.setup();
    render(<Checkbox />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveAttribute("data-state", "unchecked");

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "checked");

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
  });

  it("applies required attribute when set", () => {
    render(<Checkbox required />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeRequired();
  });

  it("forwards additional data attributes", () => {
    render(<Checkbox data-testid="remember-me" />);

    const checkbox = screen.getByTestId("remember-me");

    expect(checkbox).toBeInTheDocument();
  });

  it("renders the indicator with a check icon when checked", async () => {
    const user = userEvent.setup();
    render(<Checkbox />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox.querySelector("svg")).not.toBeInTheDocument();

    await user.click(checkbox);

    const svg = checkbox.querySelector("svg");

    expect(svg).toBeInTheDocument();
  });
});
