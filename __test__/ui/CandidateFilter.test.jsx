import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CandidateFilter from "@/components/filters/CandidateFilter";

// 🔹 Mock redux
const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (fn) =>
    fn({
      dropdown: {
        skillsDropdown: [
          { label: "React", value: "react" },
          { label: "Node", value: "node" },
        ],
      },
    }),
}));

// 🔹 Mock async dropdown action
jest.mock("@/store/actions/dropdownAction", () => ({
  asyncGetDropdown: jest.fn(() => ({ type: "GET_DROPDOWN" })),
}));

// 🔹 Mock child components
jest.mock("@/components/ui/RangeFilter", () => (props) => (
  <div data-testid="range-filter">
    <button onClick={() => props.onChange({ min: 2, max: 5 })}>
      Change Range
    </button>
  </div>
));

jest.mock("@/components/SelectField", () => (props) => (
  <div data-testid="select-field">
    <button onClick={() => props.onChange(["react", "node"])}>
      Select Skills
    </button>
  </div>
));

describe("CandidateFilter Component", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    setFilterData: jest.fn(),
    setLoading: jest.fn(),
    handleApplyFilters: jest.fn(() => Promise.resolve()),
    handleResetFilters: jest.fn(() => Promise.resolve()),
    isFilterApplied: jest.fn(() => true),
    filterData: {
      experience: "",
      skills: [],
      salaryRange: { min: 0, max: 0 },
      contractType: "",
      remotePolicy: "",
      experienceRange: { min: 0, max: 10 },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders filter panel when open", () => {
    render(<CandidateFilter {...defaultProps} />);

    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Contract Type")).toBeInTheDocument();
    expect(screen.getByText("Remote Policy")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
  });

  test("does not render when isOpen is false", () => {
    render(<CandidateFilter {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Filters")).not.toBeInTheDocument();
  });

  test("selects contract type", () => {
    render(<CandidateFilter {...defaultProps} />);

    fireEvent.click(screen.getByText("TEMPORARY"));

    expect(defaultProps.setFilterData).toHaveBeenCalled();
  });

  test("updates salary range inputs", () => {
    render(<CandidateFilter {...defaultProps} />);

    const inputs = screen.getAllByPlaceholderText(/e.g./i);

    fireEvent.change(inputs[0], { target: { value: "30000" } });
    fireEvent.change(inputs[1], { target: { value: "100000" } });

    expect(defaultProps.setFilterData).toHaveBeenCalled();
  });

  test("updates experience range", () => {
    render(<CandidateFilter {...defaultProps} />);

    fireEvent.click(screen.getByText("Change Range"));

    expect(defaultProps.setFilterData).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  test("updates skills selection", () => {
    render(<CandidateFilter {...defaultProps} />);

    fireEvent.click(screen.getByText("Select Skills"));

    expect(defaultProps.setFilterData).toHaveBeenCalled();
  });

  test("applies filters and closes panel", async () => {
    render(<CandidateFilter {...defaultProps} />);

    fireEvent.click(screen.getByText("Apply Filters"));

    await waitFor(() => {
      expect(defaultProps.handleApplyFilters).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  test("resets filters", async () => {
    render(<CandidateFilter {...defaultProps} />);

    fireEvent.click(screen.getByText("Reset"));

    await waitFor(() => {
      expect(defaultProps.handleResetFilters).toHaveBeenCalled();
      expect(defaultProps.setFilterData).toHaveBeenCalled();
    });
  });

  test("apply button disabled when filter not applied", () => {
    render(
      <CandidateFilter
        {...defaultProps}
        isFilterApplied={() => false}
      />
    );

    const applyBtn = screen.getByText("Apply Filters");
    expect(applyBtn).toBeDisabled();
  });
});
