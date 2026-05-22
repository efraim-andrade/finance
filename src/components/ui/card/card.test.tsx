import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./index";

describe("Card", () => {
  it("renders children inside Card", () => {
    render(<Card>Hello World</Card>);

    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders CardHeader with children", () => {
    render(
      <Card>
        <CardHeader>Page Title</CardHeader>
      </Card>,
    );

    expect(screen.getByText("Page Title")).toBeInTheDocument();
  });

  it("renders CardTitle with children", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
      </Card>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders CardDescription with children", () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Manage your finances</CardDescription>
        </CardHeader>
      </Card>,
    );

    expect(screen.getByText("Manage your finances")).toBeInTheDocument();
  });

  it("renders CardContent with children", () => {
    render(
      <Card>
        <CardContent>Content goes here</CardContent>
      </Card>,
    );

    expect(screen.getByText("Content goes here")).toBeInTheDocument();
  });

  it("renders CardFooter with children", () => {
    render(
      <Card>
        <CardFooter>Footer actions</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Footer actions")).toBeInTheDocument();
  });

  it("applies border-border class on Card", () => {
    const { container } = render(<Card>Bordered</Card>);

    const cardElement = container.firstChild as HTMLElement;

    expect(cardElement.className).toContain("border-border");
  });

  it("merges custom className with default classes", () => {
    const { container } = render(
      <Card className="my-custom-class">Styled</Card>,
    );

    const cardElement = container.firstChild as HTMLElement;

    expect(cardElement.className).toContain("my-custom-class");
    expect(cardElement.className).toContain("rounded-lg");
    expect(cardElement.className).toContain("border-border");
  });

  it("forwards ref to the DOM element", () => {
    let ref: HTMLDivElement | null = null;

    render(
      <Card
        ref={(el) => {
          ref = el;
        }}
      >
        Ref test
      </Card>,
    );

    expect(ref).toBeInstanceOf(HTMLDivElement);
  });

  it("passes additional HTML attributes through props", () => {
    render(
      <Card data-testid="my-card" aria-label="User profile">
        Profile
      </Card>,
    );

    const card = screen.getByTestId("my-card");

    expect(card).toHaveAttribute("aria-label", "User profile");
  });
});
