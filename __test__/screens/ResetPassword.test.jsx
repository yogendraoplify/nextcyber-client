import React, { Suspense } from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { act } from "react";
import "@testing-library/jest-dom";

import ResetPassword from "@/app/reset-password/[token]/page";
import toast from "react-hot-toast";

/* ------------------------------------------------------------------ */
/* Mocks */
/* ------------------------------------------------------------------ */

const mockPush = jest.fn();
const mockResetPassword = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock("@/api/authApi", () => ({
  resetPassword: (...args) => mockResetPassword(...args),
}));

jest.mock("next/image", () => (props) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} />;
});

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

const renderComponent = async () => {
  await act(async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword
          params={Promise.resolve({ token: "test-token" })}
        />
      </Suspense>
    );
  });
};

const VALID_PASSWORD = "Strong@123";

/* ------------------------------------------------------------------ */
/* Tests */
/* ------------------------------------------------------------------ */

describe("ResetPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders reset password screen", async () => {
    await renderComponent();

    expect(
      await screen.findByText("Reset Password")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Password")
    ).toBeInTheDocument();
  });

  test("shows validation error for weak password", async () => {
    await renderComponent();

    fireEvent.change(
      await screen.findByPlaceholderText("Password"),
      { target: { value: "123" } }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /change password/i,
      })
    );

    expect(
      await screen.findByText(
        "Password must be at least 8 characters long."
      )
    ).toBeInTheDocument();
  });

  test("submits form successfully and redirects", async () => {
    mockResetPassword.mockResolvedValueOnce({
      data: { message: "Password reset successful" },
    });

    await renderComponent();

    fireEvent.change(
      await screen.findByPlaceholderText("Password"),
      { target: { value: VALID_PASSWORD } }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /change password/i,
      })
    );

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith(
        "test-token",
        expect.objectContaining({
          password: VALID_PASSWORD,
        })
      );

      expect(toast.success).toHaveBeenCalledWith(
        "Password reset successful"
      );

      expect(mockPush).toHaveBeenCalledWith(
        "/auth/signin"
      );
    });
  });

  test("shows error toast on API failure", async () => {
    mockResetPassword.mockRejectedValueOnce({
      response: { data: { message: "Invalid token" } },
    });

    await renderComponent();

    fireEvent.change(
      await screen.findByPlaceholderText("Password"),
      { target: { value: VALID_PASSWORD } }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /change password/i,
      })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Invalid token"
      );
    });
  });

  test("disables submit button while loading", async () => {

  });

  test("renders back to login link", async () => {
    await renderComponent();

    const link = await screen.findByRole("link", {
      name: /back to login/i,
    });

    expect(link).toHaveAttribute(
      "href",
      "/auth/signin"
    );
  });
});
