import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WorkReq from "@/components/addJob/WorkReq";

jest.mock("@/components/SelectField", () => ({
  __esModule: true,
  default: ({ name }) => <div data-testid={`select-${name}`} />,
}));

describe("WorkReq Component", () => {
  let mockForm;

  beforeEach(() => {
    mockForm = {
      register: jest.fn(),
      setValue: jest.fn(),
      getValues: jest.fn(),
      watch: jest.fn(),
      formState: {
        errors: {},
      },
    };

    mockForm.watch.mockImplementation((field) => {
      if (field === "contractType") return [];
      if (field === "remotePolicy") return "";
      if (field === "languages") return [];
      return undefined;
    });

    mockForm.getValues.mockReturnValue([]);
  });

  const renderComponent = (props = {}) =>
    render(<WorkReq form={mockForm} showErrors={false} {...props} />);

  test("renders all sections correctly", () => {
    renderComponent();

    expect(screen.getByText("Work experience")).toBeInTheDocument();
    expect(screen.getByText("Contract Type")).toBeInTheDocument();
    expect(screen.getByText("Remote Policy")).toBeInTheDocument();
    expect(screen.getByText("Language Required")).toBeInTheDocument();
  });

  test("renders SelectField components", () => {
    renderComponent();

    expect(screen.getByTestId("select-minExperience")).toBeInTheDocument();
    expect(screen.getByTestId("select-maxExperience")).toBeInTheDocument();
  });

  test("registers required fields on mount", () => {
    renderComponent();

    expect(mockForm.register).toHaveBeenCalledWith(
      "contractType",
      expect.objectContaining({
        required: "Contract type is required",
      })
    );

    expect(mockForm.register).toHaveBeenCalledWith(
      "remotePolicy",
      expect.objectContaining({
        required: "Remote policy is required",
      })
    );

    expect(mockForm.register).toHaveBeenCalledWith(
      "languages",
      expect.objectContaining({
        required: "Language is required",
      })
    );
  });


  test("adds contract type when clicked", () => {
    renderComponent();

    const button = screen.getByText("Freelance");
    fireEvent.click(button);

    expect(mockForm.setValue).toHaveBeenCalledWith(
      "contractType",
      ["Freelance"],
      expect.objectContaining({
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
    );
  });

  test("removes contract type when already selected", () => {
    mockForm.watch.mockImplementation((field) => {
      if (field === "contractType") return ["Freelance"];
      return [];
    });

    mockForm.getValues.mockReturnValue(["Freelance"]);

    renderComponent();

    fireEvent.click(screen.getByText("Freelance"));

    expect(mockForm.setValue).toHaveBeenCalledWith(
      "contractType",
      [],
      expect.any(Object)
    );
  });

  test("sets remote policy when clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByText("REMOTE"));

    expect(mockForm.setValue).toHaveBeenCalledWith(
      "remotePolicy",
      "REMOTE",
      expect.objectContaining({
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
    );
  });



  test("adds language when clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByText("English"));

    expect(mockForm.setValue).toHaveBeenCalledWith(
      "languages",
      ["English"],
      expect.any(Object)
    );
  });



  test("shows contractType error when showErrors is true", () => {
    mockForm.formState.errors = {
      contractType: { message: "Contract type is required" },
    };

    render(<WorkReq form={mockForm} showErrors={true} />);

    expect(
      screen.getByText("Contract type is required")
    ).toBeInTheDocument();
  });

  test("does not show errors when showErrors is false", () => {
    mockForm.formState.errors = {
      contractType: { message: "Contract type is required" },
    };

    render(<WorkReq form={mockForm} showErrors={false} />);

    expect(
      screen.queryByText("Contract type is required")
    ).not.toBeInTheDocument();
  });
});