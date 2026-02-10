import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import NextCybrProfile from "@/components/recruiter/forms/NextCybrProfile";
import { useSelector } from "react-redux";
import { updateCompanyApi } from "@/api/companyApi";



jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("@/api/companyApi", () => ({
  updateCompanyApi: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
  default: jest.fn(),
}));

// Simplified Input
jest.mock("@/components/ui/Input", () => ({
  Input: ({ label, error, ...props }) => (
    <div>
      <label>{label}</label>
      <input aria-label={label} {...props} />
      {error && <span>{error}</span>}
    </div>
  ),
}));

// Simplified SaveButton
jest.mock("@/components/ui/SaveButton", () => ({
  SaveButton: ({ isLoading, ...props }) => (
    <button {...props} disabled={isLoading}>
      {isLoading ? "Saving..." : "Save"}
    </button>
  ),
}));

// Mock Quill editor
jest.mock("@/components/QuillEditor", () => ({
  __esModule: true,
  default: ({ value, onChange }) => (
    <textarea
      aria-label="About Company"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));



describe("NextCybrProfile", () => {
  const mockProfile = {
    companyTagline: "Build the future",
    about: "<p>About us</p>",
  };

  beforeEach(() => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: {
            companyProfile: mockProfile,
          },
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders form fields", () => {
    render(<NextCybrProfile />);

    expect(
      screen.getByLabelText("Company Tagline")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("About Company")
    ).toBeInTheDocument();
  });

  test("resets form values from redux companyProfile", async () => {
    render(<NextCybrProfile />);

    expect(
      screen.getByLabelText("Company Tagline")
    ).toHaveValue("Build the future");

    expect(
      screen.getByLabelText("About Company")
    ).toHaveValue("<p>About us</p>");
  });

  test("shows validation error when about is empty", async () => {
    render(<NextCybrProfile />);

    fireEvent.change(screen.getByLabelText("About Company"), {
      target: { value: "<p><br></p>" },
    });

    fireEvent.click(screen.getByText("Save"));

    expect(
      await screen.findByText("About company is required")
    ).toBeInTheDocument();
  });

//   test("does not call API when no fields are dirty", async () => {
//     const toast = require("react-hot-toast").default;

//     render(<NextCybrProfile />);

//     fireEvent.click(screen.getByText("Save"));

//     await waitFor(() => {
    //       expect(toast).toHaveBeenCalledWith("No changes detected");
//       expect(updateCompanyApi).not.toHaveBeenCalled();
//     });
//   });

  test("submits only dirty fields", async () => {
    updateCompanyApi.mockResolvedValueOnce({ data: {} });

    render(<NextCybrProfile />);

    fireEvent.change(screen.getByLabelText("Company Tagline"), {
      target: { value: "New tagline" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(updateCompanyApi).toHaveBeenCalledWith({
        companyTagline: "New tagline",
      });
    });
  });

  test("shows success toast on successful update", async () => {
    const toast = require("react-hot-toast");

    updateCompanyApi.mockResolvedValueOnce({ data: {} });

    render(<NextCybrProfile />);

    fireEvent.change(screen.getByLabelText("Company Tagline"), {
      target: { value: "Updated" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Company details updated successfully"
      );
    });
  });

  test("shows error toast on API failure", async () => {
    const toast = require("react-hot-toast");

    updateCompanyApi.mockRejectedValueOnce(new Error("fail"));

    render(<NextCybrProfile />);

    fireEvent.change(screen.getByLabelText("Company Tagline"), {
      target: { value: "Updated" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });


});