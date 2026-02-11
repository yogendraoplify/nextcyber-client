import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddExperienceModal from "@/components/profile/steps/AddExperienceModal";
import toast from "react-hot-toast";

jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
}));

jest.mock(
  "@/components/modal/Modal",
  () => (props) =>
    props.isOpen ? (
      <div data-testid="modal">
        <h1>{props.title}</h1>
        {props.children}
      </div>
    ) : null,
);

jest.mock("@/components/SelectField", () => (props) => (
  <select
    data-testid={props.placeholder}
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
  >
    <option value="">Select</option>
    {props.options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
));

describe("AddExperienceModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    initialData: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders modal when open", () => {
    render(<AddExperienceModal {...defaultProps} />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Add Work Experience")).toBeInTheDocument();
  });

  test("does not render when closed", () => {
    render(<AddExperienceModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  test("pre-fills form when initialData provided", () => {
    const initialData = {
      companyName: "Google",
      jobTitle: "Frontend Developer",
      startDate: "2023-01-01",
      endDate: "2023-12-01",
      description: "Worked on UI",
    };

    render(<AddExperienceModal {...defaultProps} initialData={initialData} />);

    expect(screen.getByDisplayValue("Google")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2023-01-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Worked on UI")).toBeInTheDocument();
  });

  test("shows error if required fields missing", () => {
    render(<AddExperienceModal {...defaultProps} />);

    fireEvent.click(screen.getByText("Save Changes"));

    expect(toast.error).toHaveBeenCalledWith(
      "Please enter company , job title and Start Date",
    );
    expect(mockOnSave).not.toHaveBeenCalled();
  });

//   test("calls onSave when required fields are filled", () => {
//     render(<AddExperienceModal {...defaultProps} />);

//     fireEvent.change(screen.getByTestId("Enter company name"), {
//       target: { value: "Google" },
//     });

//     fireEvent.change(screen.getByTestId("Enter job title"), {
//       target: { value: "Frontend Developer" },
//     });

//     fireEvent.change(screen.getByLabelText("Start Date"), {
//       target: { value: "2023-01-01" },
//     });

//     fireEvent.click(screen.getByText("Save Changes"));

//     expect(mockOnSave).toHaveBeenCalledWith(
//       expect.objectContaining({
//         companyName: "Google",
//         jobTitle: "Frontend Developer",
//         startDate: "2023-01-01",
//       }),
//     );
//   });

  test("updates description field", () => {
    render(<AddExperienceModal {...defaultProps} />);

    const textarea = screen.getByPlaceholderText(
      "Enter candidates profile info...",
    );

    fireEvent.change(textarea, {
      target: { value: "New description" },
    });

    expect(textarea.value).toBe("New description");
  });
});
