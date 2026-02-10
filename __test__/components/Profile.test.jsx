import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "@/components/recruiter/forms/Profile";
import { useSelector, useDispatch } from "react-redux";
import { updateCompanyApi } from "@/api/companyApi";



jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

jest.mock("@/api/companyApi", () => ({
  updateCompanyApi: jest.fn(),
}));

jest.mock("@/helper/validateImage", () => jest.fn());

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
  default: jest.fn(),
}));

jest.mock("@/store/actions/dropdownAction", () => ({
  asyncGetDropdown: jest.fn(() => ({ type: "DROPDOWN" })),
}));

jest.mock("@/components/ui/Input", () => ({
  Input: ({ label, error, ...props }) => (
    <div>
      <label>{label}</label>
      <input aria-label={label} {...props} />
      {error && <span>{error}</span>}
    </div>
  ),
}));

jest.mock("@/components/ui/SaveButton", () => ({
  SaveButton: ({ isLoading, ...props }) => (
    <button disabled={isLoading} {...props}>
      {isLoading ? "Saving..." : "Save"}
    </button>
  ),
}));

jest.mock("@/components/SelectField", () => ({
  __esModule: true,
  default: ({ label, onChange }) => (
    <div>
      <label>{label}</label>
      <select
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        <option value="FOUNDER">Founder</option>
        <option value="EMPLOYEE">Employee</option>
      </select>
    </div>
  ),
}));

jest.mock("@/components/TipsCard", () => () => <div>Tips</div>);



describe("Profile", () => {
  const dispatch = jest.fn();

  const mockState = {
    auth: {
      user: {
        firstName: "John",
        lastName: "Doe",
        companyProfile: {
          gender: "MALE",
          roleWithCompany: "FOUNDER",
          profilePicture: { url: "/logo.png" },
          profileBanner: { url: "/banner.png" },
        },
      },
    },
    dropdown: {
      rolesInCompanyDropdown: [],
    },
  };

  beforeEach(() => {
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockImplementation((cb) => cb(mockState));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders form fields with initial values", () => {
    render(<Profile />);

    expect(screen.getByLabelText("First Name")).toHaveValue("John");
    expect(screen.getByLabelText("Last Name")).toHaveValue("Doe");
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  test("fetches dropdowns on mount", () => {
    render(<Profile />);

    expect(dispatch).toHaveBeenCalled();
  });

  test("shows profile & banner preview images", () => {
    render(<Profile />);

    expect(screen.getByAltText("Profile")).toBeInTheDocument();
    expect(screen.getByAltText("Banner")).toBeInTheDocument();
  });

  test("updates gender when clicked", () => {
    render(<Profile />);

    fireEvent.click(screen.getByText("female"));

    expect(screen.getByText("female")).toHaveClass("border-primary");
  });

//   test("does not submit when no changes are made", async () => {
//     const toast = require("react-hot-toast").default;

//     render(<Profile />);

//     fireEvent.click(screen.getByText("Save"));

//     await waitFor(() => {
//       expect(updateCompanyApi).not.toHaveBeenCalled();
//       expect(toast).toHaveBeenCalledWith("No changes detected");
//     });
//   });

  test("submits only dirty fields", async () => {
    updateCompanyApi.mockResolvedValueOnce({});

    render(<Profile />);

    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "Jane" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(updateCompanyApi).toHaveBeenCalled();
    });
  });

  test("submits roleWithCompany when changed", async () => {
    updateCompanyApi.mockResolvedValueOnce({});

    render(<Profile />);

    fireEvent.change(
      screen.getByLabelText("Role within the company"),
      { target: { value: "EMPLOYEE" } }
    );

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(updateCompanyApi).toHaveBeenCalled();
    });
  });

  test("shows success toast on successful submit", async () => {
    const toast = require("react-hot-toast");

    updateCompanyApi.mockResolvedValueOnce({});

    render(<Profile />);

    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "Jane" },
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

    render(<Profile />);

    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "Jane" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

//   test("disables Save button while submitting", async () => {
//     let resolvePromise;
//     updateCompanyApi.mockReturnValue(
//       new Promise((res) => (resolvePromise = res))
//     );

//     render(<Profile />);

//     fireEvent.change(screen.getByLabelText("First Name"), {
//       target: { value: "Jane" },
//     });

//     fireEvent.click(screen.getByText("Save"));

//     expect(screen.getByText("Saving...")).toBeDisabled();

//     resolvePromise({});
//   });
});