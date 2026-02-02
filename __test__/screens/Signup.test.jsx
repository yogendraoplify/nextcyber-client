import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import SignUp from "@/app/auth/signup/page";
import { useDispatch } from "react-redux";
import { asyncSignupUser } from "@/store/actions/authActions";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(() => "STUDENT"),
  }),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("@/store/actions/authActions", () => ({
  asyncSignupUser: jest.fn(() => {
    return () => Promise.resolve(); // IMPORTANT: thunk must return Promise
  }),
}));

jest.mock("next/image", () => (props) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt || "image"} />;
});

describe("SignUp Component", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  test("renders signup page", () => {
    render(<SignUp />);

    expect(screen.getByText("Create an account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Professional email")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  test("toggles password visibility", async () => {
    render(<SignUp />);

    const passwordInput = screen.getByPlaceholderText("Password");
    const toggleBtn = screen.getByRole("button", { name: "" });

    expect(passwordInput).toHaveAttribute("type", "password");

    await act(async () => {
      fireEvent.click(toggleBtn);
    });

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  // test("renders role tabs and switches role", async () => {
  //   render(<SignUp />);

  //   const candidateTab = screen.getByText("Candidate");
  //   const recruiterTab = screen.getByText("Recruiter");

  //   expect(candidateTab).toHaveClass("bg-primary");

  //   act(() => {
  //     recruiterTab.click();
  //   });
  //   expect(recruiterTab).toHaveClass("bg-primary");
  //   expect(candidateTab).not.toHaveClass("bg-primary");
  // });

  test("shows validation errors on empty submit", async () => {
    render(<SignUp />);

    await act(async () => {
      fireEvent.click(screen.getByText("Continue"));
    });

    expect(screen.getByText("First name is required")).toBeInTheDocument();
    expect(screen.getByText("Last name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  test("dispatches signup action on valid submit", async () => {
    render(<SignUp />);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("First name"), {
        target: { value: "John" },
      });

      fireEvent.change(screen.getByPlaceholderText("Last name"), {
        target: { value: "Doe" },
      });

      fireEvent.change(screen.getByPlaceholderText("Professional email"), {
        target: { value: "john@example.com" },
      });

      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Strong@123Password" },
      });

      fireEvent.click(screen.getByText("Continue"));
    });

    expect(asyncSignupUser).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
