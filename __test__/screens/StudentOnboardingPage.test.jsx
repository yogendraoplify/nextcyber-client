import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import StudentOnboardingPage from "@/app/onboarding/[id]/page";
import { useDispatch, useSelector } from "react-redux";
import { asyncCurrentUser } from "@/store/actions/authActions";

const replaceMock = jest.fn();
const dispatchMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@/store/actions/authActions", () => ({
  asyncCurrentUser: jest.fn(() => ({ type: "CURRENT_USER" })),
}));

jest.mock("@/components/OnBoarding", () => () => (
  <div>ONBOARDING_COMPONENT</div>
));

describe("StudentOnboardingPage", () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  test("dispatches asyncCurrentUser when user is null", async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: null,
          isLoading: false,
        },
      })
    );

    render(<StudentOnboardingPage />);

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(asyncCurrentUser());
    });
  });

  test("redirects to dashboard if onboarding is complete", async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: {
            onboardingComplete: true,
          },
          isLoading: false,
        },
      })
    );

    render(<StudentOnboardingPage />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/dashboard");
    });
  });

//   test("shows loader while redirecting after onboarding complete", () => {
//     useSelector.mockImplementation((selector) =>
//       selector({
//         auth: {
//           user: {
//             onboardingComplete: true,
//           },
//           isLoading: false,
//         },
//       })
//     );

//     render(<StudentOnboardingPage />);

//     expect(screen.getByRole("img")).toBeInTheDocument();
//   });

  test("renders onboarding component when user is ready and not onboarded", () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: {
            onboardingComplete: false,
          },
          isLoading: false,
        },
      })
    );

    render(<StudentOnboardingPage />);

    expect(
      screen.getByText("ONBOARDING_COMPONENT")
    ).toBeInTheDocument();
  });
});