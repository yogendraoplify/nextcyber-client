import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import Search from "@/components/ui/Search";

describe("Search Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  const setup = (props = {}) => {
    const defaultProps = {
      value: "",
      setValue: jest.fn(),
      placeholder: "Search here",
      handleClear: jest.fn(),
      clearOnUnmount: jest.fn(),
    };

    return render(<Search {...defaultProps} {...props} />);
  };

  test("renders input with placeholder", () => {
    setup();

    expect(
      screen.getByPlaceholderText("Search here")
    ).toBeInTheDocument();
  });

  test("renders search icon", () => {
    setup();

    // lucide icons render as svg
    const svgs = document.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  test("updates value on input change", () => {
    const setValue = jest.fn();
    setup({ setValue });

    const input = screen.getByPlaceholderText("Search here");

    fireEvent.change(input, { target: { value: "react" } });

    expect(setValue).toHaveBeenCalledWith("react");
  });

  test("shows clear (X) button when value exists", () => {
    setup({ value: "hello" });

    const clearButton = screen.getByRole("button");
    expect(clearButton).toBeInTheDocument();
  });

  test("does not show clear button when value is empty", () => {
    setup({ value: "" });

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("calls handleClear when clear button is clicked", () => {
    const handleClear = jest.fn();
    setup({ value: "text", handleClear });

    fireEvent.click(screen.getByRole("button"));

    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  test("calls clearOnUnmount if value exists", () => {
    const clearOnUnmount = jest.fn();

    const { unmount } = setup({
      value: "persisted",
      clearOnUnmount,
    });

    unmount();

    expect(clearOnUnmount).toHaveBeenCalledTimes(1);
  });

  test("does NOT call clearOnUnmount if value is empty", () => {
    const clearOnUnmount = jest.fn();

    const { unmount } = setup({
      value: "",
      clearOnUnmount,
    });

    unmount();

    expect(clearOnUnmount).not.toHaveBeenCalled();
  });

  test("applies custom className", () => {
    setup({ className: "custom-class" });

    const wrapper = document.querySelector(".custom-class");
    expect(wrapper).toBeInTheDocument();
  });
});
