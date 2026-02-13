import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CandidatePreference from "@/components/addJob/CandidatePref";

jest.mock("@/components/SelectField", () => ({
  __esModule: true,
  default: ({ name }) => <div data-testid={`select-${name}`} />,
}));

describe("CandidatePreference Component", () => {
  let mockForm;

  beforeEach(() => {
    mockForm = {
      register: jest.fn(),
      setValue: jest.fn(),
      getValues: jest.fn(),
      watch: jest.fn(),
      formState: { errors: {} },
    };

    mockForm.watch.mockImplementation((field) => {
      if (field === "qualifications") return [];
      if (field === "genderPreference") return "";
      if (field === "skills") return [];
      if (field === "certifications") return [];
      return undefined;
    });
  });

  const renderComponent = (props = {}) =>
    render(
      <CandidatePreference form={mockForm} showErrors={false} {...props} />
    );


  test("renders qualification section", () => {
    renderComponent();

    expect(
      screen.getByText("Candidate’s qualification")
    ).toBeInTheDocument();
  });

  test("renders SelectFields", () => {
    renderComponent();

    expect(screen.getByTestId("select-skills")).toBeInTheDocument();
    expect(screen.getByTestId("select-certifications")).toBeInTheDocument();
  });



  test("registers qualifications with required validation", () => {
    renderComponent();

    expect(mockForm.register).toHaveBeenCalledWith(
      "qualifications",
      expect.objectContaining({
        required: "Qualification is required",
      })
    );
  });


  test("sets qualification on click", () => {
    renderComponent();

    fireEvent.click(screen.getByText("bachelors"));

    expect(mockForm.setValue).toHaveBeenCalledWith(
      "qualifications",
      "BACHELORS",
      expect.objectContaining({
        shouldDirty: true,
        shouldValidate: true,
      })
    );
  });



  test("sets gender preference on click", () => {
    renderComponent();

    fireEvent.click(screen.getByText("male"));

    expect(mockForm.setValue).toHaveBeenCalledWith(
      "genderPreference",
      "MALE",
      expect.objectContaining({
        shouldDirty: true,
        shouldValidate: true,
      })
    );
  });



  test("applies active class when qualification is selected", () => {
    mockForm.watch.mockImplementation((field) => {
      if (field === "qualifications") return ["BACHELORS"];
      return [];
    });

    const { container } = renderComponent();

    const activeBtn = screen.getByText("bachelors");
    expect(activeBtn.className).toContain("bg-primary");
  });

  test("applies inactive class when qualification not selected", () => {
    renderComponent();

    const btn = screen.getByText("bachelors");
    expect(btn.className).toContain("bg-g-600");
  });


  test("shows qualification error when showErrors is true", () => {
    mockForm.formState.errors = {
      qualification: { message: "Qualification is required" },
    };

    render(
      <CandidatePreference form={mockForm} showErrors={true} />
    );

    expect(
      screen.getByText("Qualification is required")
    ).toBeInTheDocument();
  });

  test("does not show error when showErrors is false", () => {
    mockForm.formState.errors = {
      qualification: { message: "Qualification is required" },
    };

    renderComponent();

    expect(
      screen.queryByText("Qualification is required")
    ).not.toBeInTheDocument();
  });



  test("renders selected skills as pills", () => {
    mockForm.watch.mockImplementation((field) => {
      if (field === "skills") return ["React", "AWS"];
      return [];
    });

    renderComponent();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("AWS")).toBeInTheDocument();
  });


  test("renders selected certifications as pills", () => {
    mockForm.watch.mockImplementation((field) => {
      if (field === "certifications")
        return ["PenTest+"];
      return [];
    });

    renderComponent();

    expect(screen.getByText("PenTest+")).toBeInTheDocument();
  });
});