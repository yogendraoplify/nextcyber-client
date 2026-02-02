import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Table from "@/components/ui/Table";

/* =====================================================
   MOCK DATA
===================================================== */

const columns = [
  { label: "Name", key: "name" },
  { label: "Age", key: "age" },
  {
    label: "Email",
    render: (row) => <span>{row.email}</span>,
  },
];

const data = [
  { name: "John", age: 25, email: "john@test.com" },
  { name: "Jane", age: 30, email: "jane@test.com" },
];

const ActionButton = (row) => (
  <button data-testid={`action-${row.name}`}>Action</button>
);

const NotFoundComponent = () => <div data-testid="not-found">Nothing here</div>;

/* =====================================================
   TEST SUITE
===================================================== */

describe("Table Component", () => {
  /* ---------- HEADERS ---------- */

  test("renders table headers", () => {
    render(<Table columns={columns} data={data} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  /* ---------- ROW DATA ---------- */

  test("renders table rows from data", () => {
    render(<Table columns={columns} data={data} />);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("john@test.com")).toBeInTheDocument();

    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("jane@test.com")).toBeInTheDocument();
  });

  /* ---------- RENDER FUNCTION ---------- */

  test("uses render function when provided in column", () => {
    render(<Table columns={columns} data={data} />);

    expect(screen.getByText("john@test.com")).toBeInTheDocument();
  });

  /* ---------- ACTION COLUMN ---------- */

  test("renders action column when actions prop is provided", () => {
    render(<Table columns={columns} data={data} actions={ActionButton} />);

    expect(
      screen.getByRole("columnheader", { name: "Action" })
    ).toBeInTheDocument();

    expect(screen.getByTestId("action-John")).toBeInTheDocument();
  });

  /* ---------- LOADING STATE ---------- */

  test("shows loader when loading is true and no data", () => {
    render(<Table columns={columns} data={[]} loading={true} />);

    expect(
      document.querySelector("svg.lucide-loader-circle")
    ).toBeInTheDocument();
  });

  /* ---------- EMPTY STATE ---------- */

  test("shows default no data message when data is empty", () => {
    render(<Table columns={columns} data={[]} loading={false} />);

    expect(screen.getByText("No data found.")).toBeInTheDocument();
  });

  /* ---------- CUSTOM NOT FOUND ---------- */

  test("renders custom NotFound component when provided", () => {
    render(
      <Table
        columns={columns}
        data={[]}
        loading={false}
        NotFound={NotFoundComponent}
      />
    );

    expect(screen.getByTestId("not-found")).toBeInTheDocument();
  });

  /* ---------- SAFE EMPTY ---------- */

  test("handles undefined data safely", () => {
    render(<Table columns={columns} data={undefined} />);

    expect(screen.getByText("No data found.")).toBeInTheDocument();
  });
});
