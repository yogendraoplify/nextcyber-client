import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import JobFilter from "@/components/filters/JobFilter";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetJobs } from "@/store/actions/jobActions";
import { asyncGetDropdown } from "@/store/actions/dropdownAction";



jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@/store/actions/jobActions", () => ({
  asyncGetJobs: jest.fn(),
}));

jest.mock("@/store/actions/dropdownAction", () => ({
  asyncGetDropdown: jest.fn(),
}));

jest.mock("@/components/ui/RangeFilter", () => (props) => (
  <div data-testid="range-filter" />
));

jest.mock("@/components/SelectField", () => (props) => (
  <button
    data-testid="skills-select"
    onClick={() => props.onChange(["React"])}
  >
    Mock Skills Select
  </button>
));

describe("JobFilter Component", () => {
  const mockDispatch = jest.fn(() => Promise.resolve());
  const mockSetFilterData = jest.fn();
  const mockSetLoading = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    filterData: {
      contractType: [],
      remotePolicy: [],
      salaryRange: { min: "", max: "" },
      experienceRange: { min: 0, max: 5 },
      skills: [],
    },
    setFilterData: mockSetFilterData,
    setLoading: mockSetLoading,
    isFilterApplied: jest.fn(() => true),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockReturnValue({
      skillsDropdown: [],
    });

    asyncGetJobs.mockReturnValue(() => Promise.resolve());
  });

  

  test("renders when open", () => {
    render(<JobFilter {...defaultProps} />);
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });

  test("does not render when closed", () => {
    render(<JobFilter {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Filters")).not.toBeInTheDocument();
  });

  

  test("dispatches asyncGetDropdown if skillsDropdown empty", () => {
    render(<JobFilter {...defaultProps} />);
    expect(mockDispatch).toHaveBeenCalled();
  });

  

  test("toggles contract type checkbox", () => {
    render(<JobFilter {...defaultProps} />);

    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    expect(mockSetFilterData).toHaveBeenCalled();
  });

  

  test("toggles remote policy checkbox", () => {
    render(<JobFilter {...defaultProps} />);

    const checkbox = screen.getAllByRole("checkbox")[4]; 
    fireEvent.click(checkbox);

    expect(mockSetFilterData).toHaveBeenCalled();
  });

  

  test("updates salary min input", () => {
    render(<JobFilter {...defaultProps} />);

    const minInput = screen.getAllByPlaceholderText(/e.g./i)[0];
    fireEvent.change(minInput, { target: { value: "50000" } });

    expect(mockSetFilterData).toHaveBeenCalled();
  });

  

  test("dispatches asyncGetJobs on Apply click", async () => {
    render(<JobFilter {...defaultProps} />);

    const applyBtn = screen.getByRole("button", {
      name: /apply filters/i,
    });

    fireEvent.click(applyBtn);

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  

  test("resets filters and dispatches asyncGetJobs on Reset", async () => {
    render(<JobFilter {...defaultProps} />);

    const resetBtn = screen.getByRole("button", {
      name: /reset/i,
    });

    fireEvent.click(resetBtn);

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetFilterData).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  

  test("disables buttons when filter not applied", () => {
    render(
      <JobFilter
        {...defaultProps}
        isFilterApplied={() => false}
      />
    );

    const applyBtn = screen.getByRole("button", {
      name: /apply filters/i,
    });

    const resetBtn = screen.getByRole("button", {
      name: /reset/i,
    });

    expect(applyBtn).toBeDisabled();
    expect(resetBtn).toBeDisabled();
  });
});