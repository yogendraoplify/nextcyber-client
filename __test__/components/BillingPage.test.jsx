import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { act } from "react";
import BillingPage from "@/components/BillingPage";

import {
  subscriptionsList,
  subscriptionDetails,
} from "@/api/subscriptionApi";
import toast from "react-hot-toast";

/* -------------------- MOCKS -------------------- */

// Next.js Link
jest.mock("next/link", () => {
  return ({ href, children, ...rest }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

// Pagination
jest.mock("@/components/Pagination", () => (props) => (
  <div data-testid="pagination">
    <button onClick={() => props.setPage(2)}>Next Page</button>
  </div>
));

// Search
jest.mock("@/components/ui/Search", () => ({ value, setValue }) => (
  <input
    data-testid="search-input"
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />
));

// Filter
jest.mock("@/components/ui/Filter", () => ({ onChange }) => (
  <select
    data-testid="status-filter"
    onChange={(e) => onChange(e.target.value)}
  >
    <option value="">All</option>
    <option value="PAID">Paid</option>
    <option value="UPCOMING">Upcoming</option>
  </select>
));

// Table (IMPORTANT: render invoice numbers)
jest.mock("@/components/ui/Table", () => ({ data }) => (
  <div data-testid="table">
    {data.map((row) => (
      <div key={row.invoiceNumber}>{row.invoiceNumber}</div>
    ))}
  </div>
));

// APIs
jest.mock("@/api/subscriptionApi", () => ({
  subscriptionsList: jest.fn(),
  subscriptionDetails: jest.fn(),
}));

// Toast
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
}));

// Error util
jest.mock("@/utils/errMessage", () => ({
  getErrorMessage: (_, msg) => msg,
}));

/* -------------------- TESTS -------------------- */

describe("BillingPage", () => {
  const mockSubscription = {
    type: "Pro Plan",
    billingCycle: "MONTHLY",
    amount: 99,
    user: {
      firstName: "John",
      lastName: "Doe",
    },
  };

  const mockInvoices = [
    {
      invoiceNumber: "INV-001",
      status: "PAID",
      createdAt: new Date().toISOString(),
      amountPaid: 5000,
      currency: "$",
      pdfUrl: "http://example.com/invoice.pdf",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

//   test("fetches and displays subscription details and invoices", async () => {
//     subscriptionDetails.mockResolvedValueOnce({
//       data: { data: mockSubscription },
//     });

//     subscriptionsList.mockResolvedValueOnce({
//       data: {
//         data: {
//           invoices: mockInvoices,
//           totalPages: 1,
//         },
//       },
//     });

//     render(<BillingPage />);

//     await waitFor(() => {
//       expect(subscriptionDetails).toHaveBeenCalled();
//       expect(subscriptionsList).toHaveBeenCalled();
//     });

//     expect(screen.getByText("Pro Plan")).toBeInTheDocument();
//     expect(screen.getByText("MONTHLY")).toBeInTheDocument();
//     expect(screen.getByText("INV-001")).toBeInTheDocument();
//   });

  test("handles subscription API error", async () => {
    subscriptionDetails.mockRejectedValueOnce(new Error("fail"));
    subscriptionsList.mockResolvedValueOnce({
      data: { data: { invoices: [], totalPages: 1 } },
    });

    render(<BillingPage />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to fetch subscription details."
      );
    });
  });

  test("handles invoices API error", async () => {
    subscriptionDetails.mockResolvedValueOnce({
      data: { data: mockSubscription },
    });

    subscriptionsList.mockRejectedValueOnce(new Error("fail"));

    render(<BillingPage />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to fetch invoice list."
      );
    });
  });

  test("search triggers invoice refetch after debounce", async () => {
    jest.useFakeTimers();

    subscriptionDetails.mockResolvedValue({
      data: { data: mockSubscription },
    });

    subscriptionsList.mockResolvedValue({
      data: {
        data: {
          invoices: mockInvoices,
          totalPages: 1,
        },
      },
    });

    render(<BillingPage />);

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "INV" },
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(subscriptionsList).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });

  test("changing status filter refetches invoices", async () => {
    subscriptionDetails.mockResolvedValue({
      data: { data: mockSubscription },
    });

    subscriptionsList.mockResolvedValue({
      data: {
        data: {
          invoices: mockInvoices,
          totalPages: 1,
        },
      },
    });

    render(<BillingPage />);

    fireEvent.change(screen.getByTestId("status-filter"), {
      target: { value: "PAID" },
    });

    await waitFor(() => {
      expect(subscriptionsList).toHaveBeenCalledTimes(2);
    });
  });

  test("pagination triggers page change and refetch", async () => {
    subscriptionDetails.mockResolvedValue({
      data: { data: mockSubscription },
    });

    subscriptionsList.mockResolvedValue({
      data: {
        data: {
          invoices: mockInvoices,
          totalPages: 2,
        },
      },
    });

    render(<BillingPage />);

    fireEvent.click(screen.getByText("Next Page"));

    await waitFor(() => {
      expect(subscriptionsList).toHaveBeenCalledTimes(2);
    });
  });
});