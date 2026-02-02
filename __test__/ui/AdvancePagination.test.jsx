import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdvancePagination from "@/components/ui/AdvancePagination";

describe("AdvancePagination Component", () => {

  test("renders page numbers when totalPages <= 7", () => {
    render(
      <AdvancePagination
        currentPage={1}
        totalPages={5}
        onPageChange={jest.fn()}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });


  test("disables previous button on first page", () => {
    render(
      <AdvancePagination
        currentPage={1}
        totalPages={10}
        onPageChange={jest.fn()}
      />
    );

    const prevButton = screen.getAllByRole("button")[0];
    expect(prevButton).toBeDisabled();
  });

  test("disables next button on last page", () => {
    render(
      <AdvancePagination
        currentPage={10}
        totalPages={10}
        onPageChange={jest.fn()}
      />
    );

    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[buttons.length - 1];

    expect(nextButton).toBeDisabled();
  });


  test("calls onPageChange when a page number is clicked", () => {
    const onPageChange = jest.fn();

    render(
      <AdvancePagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByText("4"));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  test("calls onPageChange when next button is clicked", () => {
    const onPageChange = jest.fn();

    render(
      <AdvancePagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[buttons.length - 1];

    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  test("calls onPageChange when previous button is clicked", () => {
    const onPageChange = jest.fn();

    render(
      <AdvancePagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const prevButton = screen.getAllByRole("button")[0];

    fireEvent.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });


  test("renders ellipsis for large page ranges", () => {
    render(
      <AdvancePagination
        currentPage={5}
        totalPages={20}
        onPageChange={jest.fn()}
      />
    );

    expect(screen.getAllByText("...").length).toBeGreaterThan(0);
  });

  test("does not call onPageChange when ellipsis is clicked", () => {
    const onPageChange = jest.fn();

    render(
      <AdvancePagination
        currentPage={5}
        totalPages={20}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getAllByText("...")[0]);

    expect(onPageChange).not.toHaveBeenCalled();
  });
});
