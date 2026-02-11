import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CompanyFilter from "@/components/filters/CompanyFilter";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetDropdown } from "@/store/actions/dropdownAction";
import { asyncGetCompanies } from "@/store/actions/companiesAction";



jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@/store/actions/dropdownAction", () => ({
  asyncGetDropdown: jest.fn(),
}));

jest.mock("@/store/actions/companiesAction", () => ({
  asyncGetCompanies: jest.fn(),
}));


jest.mock("@/components/SelectField", () => (props) => {
  return (
    <div>
      <label>{props.label}</label>
      <button
        data-testid={`select-${props.label}`}
        onClick={() => props.onChange("11-50")}
      >
        Mock Select {props.label}
      </button>
    </div>
  );
});

describe("CompanyFilter Component", () => {
  const mockDispatch = jest.fn(() => Promise.resolve());
  const mockSetFilterData = jest.fn();
  const mockSetLoading = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    filterData: {
      sectors: [],
      companySize: "",
    },
    setFilterData: mockSetFilterData,
    setLoading: mockSetLoading,
    isFilterApplied: jest.fn(() => true),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockReturnValue({
      sectorDropdown: [],
    });

    asyncGetCompanies.mockReturnValue(() => Promise.resolve());
  });

  

  test("renders when isOpen is true", () => {
    render(<CompanyFilter {...defaultProps} />);

    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Apply Filters")).toBeInTheDocument();
  });

  test("does not render when isOpen is false", () => {
    render(<CompanyFilter {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Filters")).not.toBeInTheDocument();
  });

  

  test("calls onClose when close button is clicked", () => {
    render(<CompanyFilter {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: "" });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  

  test("dispatches asyncGetDropdown on mount if sectorDropdown is empty", () => {
    render(<CompanyFilter {...defaultProps} />);
    expect(mockDispatch).toHaveBeenCalled();
  });

  

  test("dispatches asyncGetCompanies when Apply Filters clicked", async () => {
    render(<CompanyFilter {...defaultProps} />);

    const applyButton = screen.getByText("Apply Filters");
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  

  test("resets filters when Reset button clicked", async () => {
    render(<CompanyFilter {...defaultProps} />);

    const resetButton = screen.getByText("Reset");
    fireEvent.click(resetButton);

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetFilterData).toHaveBeenCalledWith({
      sectors: [],
      companySize: null,
    });
  });

  

test("disables buttons when filter is not applied", () => {
  const props = {
    ...defaultProps,
    isFilterApplied: jest.fn(() => false),
  };

  render(<CompanyFilter {...props} />);

  const applyButton = screen.getByRole("button", {
    name: /apply filters/i,
  });

  const resetButton = screen.getByRole("button", {
    name: /reset/i,
  });

  expect(applyButton).toBeDisabled();
  expect(resetButton).toBeDisabled();
});
});