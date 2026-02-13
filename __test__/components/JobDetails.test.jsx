import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import JobDetails from "@/components/addJob/JobDetails";

jest.mock("@/components/helper/LocationSearchInput", () => ({
  __esModule: true,
  default: ({ onPlaceSelected, value }) => (
    <div>
      <button
        data-testid="mock-location"
        onClick={() =>
          onPlaceSelected({
            city: "Indore",
            state: "MP",
            country: "India",
          })
        }
      >
        Select Location
      </button>
      <span>{value}</span>
    </div>
  ),
}));

jest.mock("lucide-react", () => ({
  X: () => <span data-testid="remove-icon">X</span>,
  Plus: () => <span>+</span>,
}));

describe("JobDetails Component", () => {
  let mockForm;

  beforeEach(() => {
    mockForm = {
      register: jest.fn(() => ({ name: "mocked" })),
      getValues: jest.fn(),
      setValue: jest.fn(),
      watch: jest.fn(),
      formState: { errors: {} },
    };

    mockForm.watch.mockImplementation((field) => {
      if (field === "additionalBenefits") return [];
      if (field === "jobLocation") return "";
      return undefined;
    });

    mockForm.getValues.mockReturnValue([]);
  });

  const renderComponent = (props = {}) =>
    render(<JobDetails form={mockForm} showErrors={false} {...props} />);


  test("renders job title input", () => {
    renderComponent();

    expect(
      screen.getByPlaceholderText("e.g. Penetration tester")
    ).toBeInTheDocument();
  });

  test("registers jobTitle with required validation", () => {
    renderComponent();

    expect(mockForm.register).toHaveBeenCalledWith(
      "jobTitle",
      expect.objectContaining({
        required: "Job title is required",
      })
    );
  });


  test("shows jobTitle error when showErrors is true", () => {
    mockForm.formState.errors = {
      jobTitle: { message: "Job title is required" },
    };

    render(<JobDetails form={mockForm} showErrors={true} />);

    expect(
      screen.getByText("Job title is required")
    ).toBeInTheDocument();
  });

  test("applies error class when jobTitle has error", () => {
    mockForm.formState.errors = {
      jobTitle: { message: "Error" },
    };

    const { container } = render(
      <JobDetails form={mockForm} showErrors={true} />
    );

    const input = container.querySelector("input");
    expect(input.className).toContain("border-dark-red/80");
  });


  test("sets jobLocation when place is selected", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("mock-location"));

    expect(mockForm.setValue).toHaveBeenCalledWith(
      "jobLocation",
      "Indore, MP, India",
      { shouldDirty: true }
    );
  });


  test("adds benefit on Enter key", () => {
    renderComponent();

    const input = screen.getByPlaceholderText(
      "Type and press Enter to add"
    );

    fireEvent.change(input, { target: { value: "Health Insurance" } });

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockForm.setValue).toHaveBeenCalledWith(
      "additionalBenefits",
      ["Health Insurance"],
      { shouldDirty: true }
    );
  });

  test("does not add empty benefit", () => {
    renderComponent();

    const input = screen.getByPlaceholderText(
      "Type and press Enter to add"
    );

    fireEvent.change(input, { target: { value: "   " } });

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockForm.setValue).not.toHaveBeenCalledWith(
      "additionalBenefits",
      expect.anything(),
      expect.anything()
    );
  });


  test("renders additional benefits from watch", () => {
    mockForm.watch.mockImplementation((field) => {
      if (field === "additionalBenefits")
        return ["Bonus", "WFH"];
      return "";
    });

    renderComponent();

    expect(screen.getByText("Bonus")).toBeInTheDocument();
    expect(screen.getByText("WFH")).toBeInTheDocument();
  });


  test("removes benefit when X is clicked", () => {
    mockForm.watch.mockImplementation((field) => {
      if (field === "additionalBenefits")
        return ["Bonus", "WFH"];
      return "";
    });

    mockForm.getValues.mockReturnValue(["Bonus", "WFH"]);

    renderComponent();

    const removeButtons = screen.getAllByTestId("remove-icon");

    fireEvent.click(removeButtons[0].closest("button"));

    expect(mockForm.setValue).toHaveBeenCalledWith(
      "additionalBenefits",
      ["WFH"],
      { shouldDirty: true }
    );
  });
});