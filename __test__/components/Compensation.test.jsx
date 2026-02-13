import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Compensation from "@/components/addJob/Compensation";

jest.mock("@/components/SelectField", () => ({
  __esModule: true,
  default: ({ name }) => <div data-testid={`select-${name}`} />,
}));

describe("Compensation Component", () => {
  let mockForm;

  beforeEach(() => {
    mockForm = {
      register: jest.fn(() => ({ name: "mocked" })),
      setValue: jest.fn(),
      watch: jest.fn(),
      formState: {
        errors: {},
      },
    };

    mockForm.watch.mockImplementation((field) => {
      if (field === "showSalary") return false;
      return undefined;
    });
  });

  const renderComponent = (props = {}) =>
    render(<Compensation form={mockForm} showErrors={false} {...props} />);


  test("renders Show Salary section", () => {
    renderComponent();

    expect(screen.getByText("Show Salary")).toBeInTheDocument();
    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });

  test("renders currency SelectField", () => {
    renderComponent();

    expect(screen.getByTestId("select-currency")).toBeInTheDocument();
  });

  test("renders salary inputs", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("From")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("To")).toBeInTheDocument();
  });


  test("toggles showSalary from false to true", () => {
    renderComponent();

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    expect(mockForm.setValue).toHaveBeenCalledWith(
      "showSalary",
      true,
      expect.objectContaining({
        shouldDirty: true,
        shouldValidate: true,
      })
    );
  });

  test("shows Enabled when showSalary is true", () => {
    mockForm.watch.mockImplementation((field) => {
      if (field === "showSalary") return true;
      return undefined;
    });

    renderComponent();

    expect(screen.getByText("Enabled")).toBeInTheDocument();
  });


  test("applies active background class when enabled", () => {
    mockForm.watch.mockReturnValue(true);

    const { container } = renderComponent();

    const toggle = container.querySelector(".bg-primary");
    expect(toggle).toBeInTheDocument();
  });

  test("applies inactive background class when disabled", () => {
    mockForm.watch.mockReturnValue(false);

    const { container } = renderComponent();

    const toggle = container.querySelector(".bg-g-300");
    expect(toggle).toBeInTheDocument();
  });



  test("shows salary range error when showErrors is true", () => {
    mockForm.formState.errors = {
      salaryFrom: { message: "Required" },
    };

    render(<Compensation form={mockForm} showErrors={true} />);

    expect(
      screen.getByText("Salary range is required.")
    ).toBeInTheDocument();
  });

  test("does not show salary error when showErrors is false", () => {
    mockForm.formState.errors = {
      salaryFrom: { message: "Required" },
    };

    render(<Compensation form={mockForm} showErrors={false} />);

    expect(
      screen.queryByText("Salary range is required.")
    ).not.toBeInTheDocument();
  });

  test("applies error class when field has error", () => {
    mockForm.formState.errors = {
      salaryFrom: { message: "Required" },
    };

    const { container } = render(
      <Compensation form={mockForm} showErrors={true} />
    );

    const input = container.querySelector("input[placeholder='From']");
    expect(input.className).toContain("border-red-600");
  });

  test("applies normal class when no error", () => {
    const { container } = renderComponent();

    const input = container.querySelector("input[placeholder='From']");
    expect(input.className).toContain("border-g-600");
  });


  test("registers salary fields with validation", () => {
    renderComponent();

    expect(mockForm.register).toHaveBeenCalledWith(
      "salaryFrom",
      expect.objectContaining({
        validate: expect.any(Function),
      })
    );

    expect(mockForm.register).toHaveBeenCalledWith(
      "salaryTo",
      expect.objectContaining({
        validate: expect.any(Function),
      })
    );
  });
});