import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "@/components/Pagination";

describe("Pagination component", () => {
  test("renders current page and total pages", () => {
    render(
      <Pagination
        page={1}
        setPage={jest.fn()}
        pageSize={10}
        setPageSize={jest.fn()}
        totalPages={5}
      />
    );

    expect(screen.getByText("1 of 5")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("previous button is disabled on first page", () => {
    render(
      <Pagination
        page={1}
        setPage={jest.fn()}
        pageSize={10}
        setPageSize={jest.fn()}
        totalPages={5}
      />
    );

    const prevBtn = screen.getAllByRole("button")[1];
    expect(prevBtn).toBeDisabled();
  });

  test("next button is disabled on last page", () => {
    render(
      <Pagination
        page={5}
        setPage={jest.fn()}
        pageSize={10}
        setPageSize={jest.fn()}
        totalPages={5}
      />
    );

    const nextBtn = screen.getAllByRole("button")[2];
    expect(nextBtn).toBeDisabled();
  });

  test("clicking next button increments page", () => {
    const setPage = jest.fn();

    render(
      <Pagination
        page={2}
        setPage={setPage}
        pageSize={10}
        setPageSize={jest.fn()}
        totalPages={5}
      />
    );

    const nextBtn = screen.getAllByRole("button")[2];
    fireEvent.click(nextBtn);

    expect(setPage).toHaveBeenCalled();
  });

  test("clicking previous button decrements page", () => {
    const setPage = jest.fn();

    render(
      <Pagination
        page={3}
        setPage={setPage}
        pageSize={10}
        setPageSize={jest.fn()}
        totalPages={5}
      />
    );

    const prevBtn = screen.getAllByRole("button")[1];
    fireEvent.click(prevBtn);

    expect(setPage).toHaveBeenCalled();
  });

  test("opens rows-per-page dropdown", () => {
    render(
      <Pagination
        page={1}
        setPage={jest.fn()}
        pageSize={10}
        setPageSize={jest.fn()}
        totalPages={5}
      />
    );

    fireEvent.click(screen.getByText("10"));

    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  test("selecting page size updates page size and resets page", () => {
    const setPage = jest.fn();
    const setPageSize = jest.fn();

    render(
      <Pagination
        page={3}
        setPage={setPage}
        pageSize={10}
        setPageSize={setPageSize}
        totalPages={5}
      />
    );

    fireEvent.click(screen.getByText("10"));
    fireEvent.click(screen.getByText("20"));

    expect(setPage).toHaveBeenCalledWith(1);
    expect(setPageSize).toHaveBeenCalledWith(20);
  });

  test("dropdown closes when clicking outside", () => {
    render(
      <Pagination
        page={1}
        setPage={jest.fn()}
        pageSize={10}
        setPageSize={jest.fn()}
        totalPages={5}
      />
    );

    fireEvent.click(screen.getByText("10"));
    expect(screen.getByText("20")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText("20")).not.toBeInTheDocument();
  });
});