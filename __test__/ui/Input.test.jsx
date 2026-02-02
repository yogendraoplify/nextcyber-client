import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Input } from "@/components/ui/Input";

describe("Input Component", () => {

  test("renders input with placeholder", () => {
    render(<Input placeholder="Enter name" />);

    expect(
      screen.getByPlaceholderText("Enter name")
    ).toBeInTheDocument();
  });


  test("renders label when provided", () => {
    render(
      <Input
        label="Email"
        placeholder="Enter email"
      />
    );

    expect(
      screen.getByText("Email")
    ).toBeInTheDocument();
  });

  test("does not render label when not provided", () => {
    render(<Input placeholder="Enter value" />);

    expect(
      screen.queryByText("Email")
    ).not.toBeInTheDocument();
  });


  test("renders error message when error is provided", () => {
    render(
      <Input
        placeholder="Enter email"
        error="Email is required"
      />
    );

    expect(
      screen.getByText("Email is required")
    ).toBeInTheDocument();
  });

  test("does not render error message when error is not provided", () => {
    render(<Input placeholder="Enter email" />);

    expect(
      screen.queryByText(/required/i)
    ).not.toBeInTheDocument();
  });


  test("applies error border class when error exists", () => {
    render(
      <Input
        placeholder="Enter email"
        error="Invalid email"
      />
    );

    const input = screen.getByPlaceholderText(
      "Enter email"
    );

    expect(input.className).toContain(
      "border-dark-red"
    );
  });


  test("applies custom className to input", () => {
    render(
      <Input
        placeholder="Enter name"
        className="custom-class"
      />
    );

    const input = screen.getByPlaceholderText(
      "Enter name"
    );

    expect(input.className).toContain(
      "custom-class"
    );
  });


  test("forwards ref to input element", () => {
    const ref = createRef();

    render(
      <Input
        ref={ref}
        placeholder="Enter value"
      />
    );

    expect(ref.current).toBeInstanceOf(
      HTMLInputElement
    );
  });
});
