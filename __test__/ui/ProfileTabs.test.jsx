import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfileTabs from "@/components/recruiter/ProfileTabs";

describe("ProfileTabs (Company)", () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all tabs correctly", () => {
    render(<ProfileTabs active="company" onChange={onChange} />);

    expect(screen.getByText("Company Details")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("NextCybr Profile")).toBeInTheDocument();
  });

  test("highlights active tab", () => {
    render(<ProfileTabs active="profile" onChange={onChange} />);

    const activeTab = screen.getByText("Profile");
    const inactiveTab = screen.getByText("Company Details");

    expect(activeTab).toHaveClass("bg-primary");
    expect(inactiveTab).not.toHaveClass("bg-primary");
  });

  test("calls onChange with correct key when tab is clicked", () => {
    render(<ProfileTabs active="company" onChange={onChange} />);

    fireEvent.click(screen.getByText("Profile"));
    expect(onChange).toHaveBeenCalledWith("profile");

    fireEvent.click(screen.getByText("NextCybr Profile"));
    expect(onChange).toHaveBeenCalledWith("nextcybr");
  });

  test("does not break when clicking active tab", () => {
    render(<ProfileTabs active="company" onChange={onChange} />);

    fireEvent.click(screen.getByText("Company Details"));

    expect(onChange).toHaveBeenCalledWith("company");
  });

  test("renders correct number of tabs", () => {
    render(<ProfileTabs active="company" onChange={onChange} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });
});
