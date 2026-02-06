import React from "react";
import { render, screen } from "@testing-library/react";
import Section from "@/components/Section";

describe("Section component", () => {
  test("renders the title correctly", () => {
    render(
      <Section title="About Us">
        This is the about section
      </Section>
    );

    const heading = screen.getByRole("heading", { name: "About Us" });

    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H2");
  });

  test("renders children content", () => {
    render(
      <Section title="Description">
        <span>Some description text</span>
      </Section>
    );

    expect(
      screen.getByText("Some description text")
    ).toBeInTheDocument();
  });

  test("renders multiple children correctly", () => {
    render(
      <Section title="Details">
        <span>Line 1</span>
        <span>Line 2</span>
      </Section>
    );

    expect(screen.getByText("Line 1")).toBeInTheDocument();
    expect(screen.getByText("Line 2")).toBeInTheDocument();
  });

  test("matches semantic structure", () => {
    render(
      <Section title="Semantic Test">
        Paragraph content
      </Section>
    );

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Semantic Test",
    });

    const paragraph = screen.getByText("Paragraph content");

    expect(heading).toBeInTheDocument();
    expect(paragraph.tagName).toBe("P");
  });
});