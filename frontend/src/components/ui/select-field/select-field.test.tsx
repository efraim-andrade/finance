import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldType } from "../field";
import {
  SelectField,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from "./index";

describe("SelectField", () => {
  it("renders SelectTrigger with placeholder text", () => {
    render(
      <SelectField placeholder="Choose an option">
        <SelectItem value="a">A</SelectItem>
      </SelectField>,
    );

    expect(screen.getByText("Choose an option")).toBeInTheDocument();
  });

  it("renders children inside SelectContent when trigger is clicked", () => {
    render(
      <SelectField defaultOpen placeholder="Pick">
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
      </SelectField>,
    );

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("passes label to the Field component", () => {
    render(
      <SelectField label="Country" placeholder="Pick">
        <SelectItem value="a">A</SelectItem>
      </SelectField>,
    );

    expect(screen.getByText("Country")).toBeInTheDocument();
  });

  it("passes helper to the Field component", () => {
    render(
      <SelectField helper="Select your country" placeholder="Pick">
        <SelectItem value="a">A</SelectItem>
      </SelectField>,
    );

    expect(screen.getByText("Select your country")).toBeInTheDocument();
  });

  it("passes type to the Field component and shows the corresponding icon", () => {
    const { container } = render(
      <SelectField type={FieldType.user} placeholder="Pick">
        <SelectItem value="a">A</SelectItem>
      </SelectField>,
    );

    const iconSpan = container.querySelector(
      'span[class*="absolute"][class*="left-2"]',
    );

    expect(iconSpan).toBeInTheDocument();
    expect(iconSpan?.querySelector("svg")).toBeInTheDocument();
  });

  it("passes contentProps to SelectContent", () => {
    render(
      <SelectField
        defaultOpen
        contentProps={{ "aria-label": "Options list" }}
        placeholder="Pick"
      >
        <SelectItem value="a">A</SelectItem>
      </SelectField>,
    );

    const list = screen.getByLabelText("Options list");

    expect(list).toBeInTheDocument();
  });

  it("applies custom className to SelectTrigger", () => {
    const { container } = render(
      <SelectField className="my-custom-class" placeholder="Pick">
        <SelectItem value="a">A</SelectItem>
      </SelectField>,
    );

    const trigger = container.querySelector('[role="combobox"]');

    expect(trigger).toHaveClass("my-custom-class");
  });

  it("re-exports SelectGroup, SelectLabel, and SelectSeparator", () => {
    render(
      <SelectField defaultOpen placeholder="Pick">
        <SelectGroup>
          <SelectLabel>Group Label</SelectLabel>
          <SelectItem value="a">A</SelectItem>
          <SelectSeparator />
          <SelectItem value="b">B</SelectItem>
        </SelectGroup>
      </SelectField>,
    );

    expect(screen.getByText("Group Label")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});
