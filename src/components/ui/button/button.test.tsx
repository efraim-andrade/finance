import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./index";

describe("Button", () => {
  it("renders a button element", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
  });

  it("renders children text", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("has data-slot attribute set to button", () => {
    render(<Button>Slot</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("uses default variant and size data attributes when none are provided", () => {
    render(<Button>Default</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("data-variant", "default");
    expect(button).toHaveAttribute("data-size", "default");
  });

  it("renders with the default variant class", () => {
    render(<Button>Default</Button>);

    const button = screen.getByRole("button");

    expect(button.className).toContain("bg-primary");
    expect(button.className).toContain("text-primary-foreground");
  });

  it("renders with the destructive variant", () => {
    render(<Button variant="destructive">Delete</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("data-variant", "destructive");
    expect(button.className).toContain("bg-destructive");
  });

  it("renders with the outline variant", () => {
    render(<Button variant="outline">Outline</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button.className).toContain("border");
    expect(button.className).toContain("bg-background");
  });

  it("renders with the secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("data-variant", "secondary");
    expect(button.className).toContain("bg-secondary");
  });

  it("renders with the ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("data-variant", "ghost");
    expect(button.className).toContain("hover:bg-accent");
  });

  it("renders with the link variant", () => {
    render(<Button variant="link">Link</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("data-variant", "link");
    expect(button.className).toContain("underline-offset-4");
  });

  it("renders with the sm size", () => {
    render(<Button size="sm">Small</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("data-size", "sm");
    expect(button.className).toContain("h-8");
  });

  it("renders with the lg size", () => {
    render(<Button size="lg">Large</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("data-size", "lg");
    expect(button.className).toContain("h-10");
  });

  it("renders with the icon size", () => {
    render(<Button size="icon">+</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("data-size", "icon");
    expect(button.className).toContain("size-9");
  });

  it("merges custom className with CVA classes", () => {
    render(<Button className="my-custom-class">Styled</Button>);

    const button = screen.getByRole("button");

    expect(button.className).toContain("my-custom-class");
    expect(button.className).toContain("bg-primary");
    expect(button.className).toContain("h-9");
  });

  it("forwards the disabled attribute", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
  });

  it("applies disabled styling classes", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button");

    expect(button.className).toContain("disabled:opacity-50");
    expect(button.className).toContain("disabled:pointer-events-none");
  });

  it("forwards the type attribute", () => {
    render(<Button type="submit">Submit</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("type", "submit");
  });

  it("forwards additional HTML attributes like aria-label", () => {
    render(<Button aria-label="Close dialog">X</Button>);

    const button = screen.getByRole("button", { name: "Close dialog" });

    expect(button).toBeInTheDocument();
  });

  describe("when asChild is true", () => {
    it("renders the child element instead of a button", () => {
      render(
        <Button asChild>
          <a href="/test">Link</a>
        </Button>,
      );

      const link = screen.getByRole("link");

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("applies data attributes and className to the child element", () => {
      render(
        <Button asChild variant="outline" size="sm">
          <a href="/test">Link</a>
        </Button>,
      );

      const link = screen.getByRole("link");

      expect(link).toHaveAttribute("data-slot", "button");
      expect(link).toHaveAttribute("data-variant", "outline");
      expect(link).toHaveAttribute("data-size", "sm");
      expect(link.className).toContain("border");
    });
  });

  it("renders a self-closing button when no children are provided", () => {
    const { container } = render(<Button />);

    const button = container.querySelector("button");

    expect(button).toBeInTheDocument();
    expect(button?.textContent).toBe("");
  });

  it("passes additional data attributes through props", () => {
    render(<Button data-testid="action-btn">Action</Button>);

    const button = screen.getByTestId("action-btn");

    expect(button).toBeInTheDocument();
  });
});
