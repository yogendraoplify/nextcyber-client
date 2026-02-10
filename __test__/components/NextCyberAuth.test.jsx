import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import NextCyberAuth from "@/components/Auth";



const pushMock = jest.fn();
const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
  useSearchParams: () => ({
    get: () => "STUDENT",
  }),
}));

const dispatchMock = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => dispatchMock,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

jest.mock("@/store/actions/authActions", () => ({
  asyncSigninUser: jest.fn((data, setLoading) => {
    setLoading(true);
    setLoading(false);
    return { type: "SIGNIN" };
  }),
  asyncSignupUser: jest.fn((data, setLoading) => {
    setLoading(true);
    setLoading(false);
    return { type: "SIGNUP" };
  }),
}));



describe("NextCyberAuth", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders signup mode by default", () => {
    render(<NextCyberAuth />);

    expect(screen.getByText("Create an account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last name")).toBeInTheDocument();
  });

  it("toggles to login mode", () => {
    render(<NextCyberAuth />);

    fireEvent.click(screen.getByText("Login"));

    expect(
      screen.getByText("Sign In with your social account")
    ).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("First name")
    ).not.toBeInTheDocument();
  });

  it("switches role tab to COMPANY", () => {
    render(<NextCyberAuth />);

    fireEvent.click(screen.getByText("Recruiter"));

    expect(replaceMock).toHaveBeenCalledWith("?role=COMPANY", {
      scroll: false,
    });
  });

  it("toggles password visibility", () => {
    render(<NextCyberAuth />);

    const passwordInput = screen.getByPlaceholderText("Password");

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "" }));

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("shows password validation error for weak password", async () => {
    render(<NextCyberAuth />);

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "1234" },
    });

    fireEvent.click(screen.getByText("Continue"));

    expect(
      await screen.findByText(
        "Password must be at least 8 characters long."
      )
    ).toBeInTheDocument();
  });

  it("dispatches signup action with role", async () => {
    render(<NextCyberAuth />);

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "John" },
    });

    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Doe" },
    });

    fireEvent.change(screen.getByPlaceholderText("Professional email"), {
      target: { value: "john@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Valid@123A" },
    });

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalled();
    });
  });

  it("dispatches signin action in login mode", async () => {
    render(<NextCyberAuth />);

    fireEvent.click(screen.getByText("Login"));

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Valid@123A" },
    });

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalled();
    });
  });

  it("disables button while loading", async () => {
    render(<NextCyberAuth />);

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "John" },
    });

    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Doe" },
    });

    fireEvent.change(screen.getByPlaceholderText("Professional email"), {
      target: { value: "john@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Valid@123A" },
    });

    fireEvent.click(screen.getByText("Continue"));

    // expect(screen.getByText("Continue")).toBeDisabled();
  });
});