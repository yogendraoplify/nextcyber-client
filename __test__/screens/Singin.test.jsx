import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignIn from "@/screens/auth/SignIn";
import { act } from "react";


jest.mock("next/image", () => (props) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt} />;
});

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    get: () => "STUDENT",
  }),
}));


const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));


jest.mock("@/store/actions/authActions", () => ({
  asyncSigninUser: jest.fn(() => jest.fn()),
}));

import { asyncSigninUser } from "@/store/actions/authActions";



describe("SignIn Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders email and password inputs", () => {
    render(<SignIn />);

    expect(
      screen.getByPlaceholderText("Email")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Password")
    ).toBeInTheDocument();
  });

  test("renders role tabs", () => {
    render(<SignIn />);

    expect(screen.getByText("Candidate")).toBeInTheDocument();
    expect(screen.getByText("Recruiter")).toBeInTheDocument();
  });

  test("toggles password visibility", () => {
    render(<SignIn />);

    const passwordInput =
      screen.getByPlaceholderText("Password");

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(
      screen.getByRole("button", { name: "" })
    );

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  test("switches role tab to COMPANY", () => {
    render(<SignIn />);

    fireEvent.click(screen.getByText("Recruiter"));

    expect(mockReplace).toHaveBeenCalledWith("?role=COMPANY", {
      scroll: false,
    });
  });

  test("shows validation error for invalid email", async () => {
    render(<SignIn />);

    fireEvent.change(
      screen.getByPlaceholderText("Email"),
      { target: { value: "invalid-email" } }
    );

    fireEvent.click(screen.getByText("Continue"));

    expect(
      await screen.findByText("Invalid email address")
    ).toBeInTheDocument();
  });

  test("dispatches signin action on valid submit", async () => {
    render(<SignIn />);

    await act(async () => {
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Valid@123Password" },
    });

    fireEvent.click(screen.getByText("Continue"));
  });

  expect(asyncSigninUser).toHaveBeenCalledTimes(1);
  expect(mockDispatch).toHaveBeenCalledTimes(1);

  });

  test("renders social login buttons for STUDENT", () => {
    render(<SignIn />);

    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("Google")).toBeInTheDocument();
  });

  test("renders signup link with role", () => {
    render(<SignIn />);

    expect(
      screen.getByText("Sign Up").closest("a")
    ).toHaveAttribute("href", "/auth/signup?role=STUDENT");
  });
});
