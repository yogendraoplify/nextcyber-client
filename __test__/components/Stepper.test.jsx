import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Stepper from "@/components/profile/ProfileStepper";

describe("Stepper Component", () => {
  const setup = (props = {}) => {
    const onChange = jest.fn();
    render(<Stepper onChange={onChange} {...props} />);
    return { onChange };
  };

  test("renders all step labels", () => {
    setup();

    expect(screen.getByText("Account Details")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Technical")).toBeInTheDocument();
  });

  test("defaults to first step as active", () => {
    setup();

    const activeButton = screen.getByText("Account Details");
    expect(activeButton.className).toContain("bg-primary");
    expect(activeButton.className).toContain("text-g-50");
  });

  test("applies active styles to the correct step", () => {
    setup({ step: 1 });

    const activeButton = screen.getByText("Profile");
    const inactiveButton = screen.getByText("Account Details");

    expect(activeButton.className).toContain("bg-primary");
    expect(inactiveButton.className).toContain("text-g-200");
  });

  test("calls onChange with correct index when a step is clicked", () => {
    const { onChange } = setup();

    fireEvent.click(screen.getByText("Profile"));
    fireEvent.click(screen.getByText("Technical"));

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, 1);
    expect(onChange).toHaveBeenNthCalledWith(2, 2);
  });

  test("calls onChange even when clicking the active step", () => {
    const { onChange } = setup({ step: 0 });

    fireEvent.click(screen.getByText("Account Details"));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  test("renders all steps as buttons", () => {
    setup();

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });
});