import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfileSetting from "@/components/profile/ProfileSetting";
import { useSelector } from "react-redux";

// 🔹 Mock next/link (VERY IMPORTANT)
jest.mock("next/link", () => {
  return ({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

// 🔹 Mock react-redux
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("ProfileSetting Component", () => {
  const mockSetProfileSettingOpen = jest.fn();

  const renderComponent = (userOverrides = {}) => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@test.com",
            role: "STUDENT",
            ...userOverrides,
          },
        },
      })
    );

    return render(
      <ProfileSetting setProfileSettingOpen={mockSetProfileSettingOpen} />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders user name and email", () => {
    renderComponent();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@test.com")).toBeInTheDocument();
  });

  test("renders 'My Jobs' link for STUDENT role", () => {
    renderComponent({ role: "STUDENT" });

    const myJobsLink = screen.getByRole("link", { name: /my jobs/i });
    expect(myJobsLink).toBeInTheDocument();
    expect(myJobsLink).toHaveAttribute("href", "/myjobs");
  });

  test("does NOT render 'My Jobs' link for non-STUDENT role", () => {
    renderComponent({ role: "ADMIN" });

    expect(
      screen.queryByRole("link", { name: /my jobs/i })
    ).not.toBeInTheDocument();
  });

  test("renders 'Update Profile' link always", () => {
    renderComponent();

    const updateProfileLink = screen.getByRole("link", {
      name: /update profile/i,
    });

    expect(updateProfileLink).toBeInTheDocument();
    expect(updateProfileLink).toHaveAttribute("href", "/profile");
  });

  test("calls setProfileSettingOpen(false) when 'My Jobs' is clicked", () => {
    renderComponent();

    const myJobsLink = screen.getByRole("link", { name: /my jobs/i });
    fireEvent.click(myJobsLink);

    expect(mockSetProfileSettingOpen).toHaveBeenCalledTimes(1);
    expect(mockSetProfileSettingOpen).toHaveBeenCalledWith(false);
  });

  test("calls setProfileSettingOpen(false) when 'Update Profile' is clicked", () => {
    renderComponent();

    const updateProfileLink = screen.getByRole("link", {
      name: /update profile/i,
    });

    fireEvent.click(updateProfileLink);

    expect(mockSetProfileSettingOpen).toHaveBeenCalledTimes(1);
    expect(mockSetProfileSettingOpen).toHaveBeenCalledWith(false);
  });
});