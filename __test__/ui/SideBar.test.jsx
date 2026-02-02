import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Sidebar from "@/components/navigation/SideBar";

const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

jest.mock("next/link", () => {
  return ({ href, children }) => <a href={href}>{children}</a>;
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

import { useSelector } from "react-redux";
import { asyncSignOutUser } from "@/store/actions/authActions";
import { toggleSidebar } from "@/store/slices/appSettingsSlice";

jest.mock("@/store/actions/authActions", () => ({
  asyncSignOutUser: jest.fn(() => ({ type: "LOGOUT" })),
}));

jest.mock("@/store/slices/appSettingsSlice", () => ({
  toggleSidebar: jest.fn(() => ({ type: "TOGGLE_SIDEBAR" })),
}));

const renderSidebar = ({
  role = "STUDENT",
  collapseSidebar = false,
  isMobileOpen = false,
  toggleMobile = jest.fn(),
} = {}) => {
  useSelector.mockImplementation((selector) =>
    selector({
      auth: {
        user: { role },
      },
      appSettings: {
        collapseSidebar,
      },
    })
  );

  return render(
    <Sidebar isMobileOpen={isMobileOpen} toggleMobile={toggleMobile} />
  );
};

describe("Sidebar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ---------- STUDENT ROLE ---------- */

  test("renders student sidebar items", () => {
    renderSidebar({ role: "STUDENT" });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Jobs")).toBeInTheDocument();
    expect(screen.getByText("Companies")).toBeInTheDocument();
    expect(screen.getByText("Plans & Subscription")).toBeInTheDocument();
  });

  /* ---------- COMPANY ROLE ---------- */

  test("renders company sidebar items", () => {
    renderSidebar({ role: "COMPANY" });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Job Postings")).toBeInTheDocument();
    expect(screen.getByText("Candidate Search")).toBeInTheDocument();
    expect(screen.getByText("Payment & Finances")).toBeInTheDocument();
  });

  test("marks dashboard icon as active for current route", () => {
    renderSidebar();

    const dashboardIcon = screen.getByText("Dashboard").previousSibling;

    expect(dashboardIcon).toHaveClass("text-g-100");
  });

  test("dispatches toggleSidebar when collapse button clicked", () => {
    renderSidebar({ collapseSidebar: false });

    const toggleBtn = screen.getAllByRole("button")[0];
    fireEvent.click(toggleBtn);

    expect(mockDispatch).toHaveBeenCalledWith(toggleSidebar());
  });

  test("logs out user and redirects to signin", () => {
    renderSidebar();

    fireEvent.click(screen.getByText("Logout"));

    expect(replaceMock).toHaveBeenCalledWith("/auth/signin");
    expect(mockDispatch).toHaveBeenCalledWith(asyncSignOutUser());
  });

  test("renders mobile sidebar when isMobileOpen is true", () => {
    renderSidebar({ isMobileOpen: true });

    const logos = screen.getAllByAltText("nextcybr-logo");
    expect(logos.length).toBeGreaterThan(0);

    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
  });

  test("closes mobile sidebar on close button click", () => {
    const toggleMobile = jest.fn();

    renderSidebar({
      isMobileOpen: true,
      toggleMobile,
    });

    // Target the close (X) button explicitly
    const closeButton = screen
      .getAllByRole("button")
      .find((btn) => btn.innerHTML.includes("lucide-x"));

    fireEvent.click(closeButton);

    expect(toggleMobile).toHaveBeenCalledTimes(1);
  });
});
