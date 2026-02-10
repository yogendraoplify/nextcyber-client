import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RangeFilter from "@/components/ui/RangeFilter";

describe("RangeFilter component", () => {
  test("renders with default min and max when no value prop is provided", () => {
    render(<RangeFilter />);

    expect(screen.getByText("0 yrs")).toBeInTheDocument();
    expect(screen.getByText("10 yrs")).toBeInTheDocument();
  });

  test("renders with provided value prop", () => {
    render(<RangeFilter value={{ min: 2, max: 8 }} />);

    expect(screen.getByText("2 yrs")).toBeInTheDocument();
    expect(screen.getByText("8 yrs")).toBeInTheDocument();
  });

  test("calls onChange when min slider changes", () => {
    const onChange = jest.fn();

    render(
      <RangeFilter
        min={0}
        max={10}
        step={1}
        value={{ min: 2, max: 8 }}
        onChange={onChange}
      />
    );

    const sliders = screen.getAllByRole("slider");
    const minSlider = sliders[0];

    fireEvent.change(minSlider, { target: { value: "4" } });

    expect(onChange).toHaveBeenCalledWith({ min: 4, max: 8 });
    expect(screen.getByText("4 yrs")).toBeInTheDocument();
  });

  test("min slider cannot cross max minus step", () => {
    const onChange = jest.fn();

    render(
      <RangeFilter
        min={0}
        max={10}
        step={1}
        value={{ min: 7, max: 8 }}
        onChange={onChange}
      />
    );

    const [minSlider] = screen.getAllByRole("slider");

    // Try to move min beyond max - step
    fireEvent.change(minSlider, { target: { value: "9" } });

    // Should clamp to max - step = 7
    expect(onChange).toHaveBeenCalledWith({ min: 7, max: 8 });
    expect(screen.getByText("7 yrs")).toBeInTheDocument();
  });

  test("calls onChange when max slider changes", () => {
    const onChange = jest.fn();

    render(
      <RangeFilter
        min={0}
        max={10}
        step={1}
        value={{ min: 2, max: 8 }}
        onChange={onChange}
      />
    );

    const sliders = screen.getAllByRole("slider");
    const maxSlider = sliders[1];

    fireEvent.change(maxSlider, { target: { value: "9" } });

    expect(onChange).toHaveBeenCalledWith({ min: 2, max: 9 });
    expect(screen.getByText("9 yrs")).toBeInTheDocument();
  });

  test("max slider cannot cross min plus step", () => {
    const onChange = jest.fn();

    render(
      <RangeFilter
        min={0}
        max={10}
        step={1}
        value={{ min: 7, max: 8 }}
        onChange={onChange}
      />
    );

    const [, maxSlider] = screen.getAllByRole("slider");

    // Try to move max below min + step
    fireEvent.change(maxSlider, { target: { value: "6" } });

    // Should clamp to min + step = 8
    expect(onChange).toHaveBeenCalledWith({ min: 7, max: 8 });
    expect(screen.getByText("8 yrs")).toBeInTheDocument();
  });

  test("updates internal state when value prop changes", () => {
    const { rerender } = render(
      <RangeFilter value={{ min: 1, max: 5 }} />
    );

    expect(screen.getByText("1 yrs")).toBeInTheDocument();
    expect(screen.getByText("5 yrs")).toBeInTheDocument();

    rerender(<RangeFilter value={{ min: 3, max: 7 }} />);

    expect(screen.getByText("3 yrs")).toBeInTheDocument();
    expect(screen.getByText("7 yrs")).toBeInTheDocument();
  });
});