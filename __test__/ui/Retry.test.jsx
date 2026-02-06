import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Retry from "@/components/ui/Retry";

describe("Retry component", () => {
  test("renders default error message when no error prop is provided", () => {
    render(<Retry onRetry={jest.fn()} />);

    expect(
      screen.getByText("Something went wrong")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Something went wrong. Please try again.")
    ).toBeInTheDocument();
  });

  test("renders custom error message when error prop is provided", () => {
    render(
      <Retry
        error="Failed to load data"
        onRetry={jest.fn()}
      />
    );

    expect(
      screen.getByText("Failed to load data")
    ).toBeInTheDocument();
  });

  test("renders Retry button", () => {
    render(<Retry onRetry={jest.fn()} />);

    const button = screen.getByRole("button", { name: /retry/i });
    expect(button).toBeInTheDocument();
  });

  test("calls onRetry callback when Retry button is clicked", () => {
    const onRetryMock = jest.fn();

    render(<Retry onRetry={onRetryMock} />);

    fireEvent.click(
      screen.getByRole("button", { name: /retry/i })
    );

    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });

  test("renders alert and refresh icons without crashing", () => {
    render(<Retry onRetry={jest.fn()} />);

    // We don’t assert SVG internals, just ensure component renders
    expect(
      screen.getByText("Something went wrong")
    ).toBeInTheDocument();
  });
});