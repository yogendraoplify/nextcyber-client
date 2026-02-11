import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RecruiterProfilePage from "@/components/recruiter/ProfilePage";




jest.mock("@/components/recruiter/forms/CompanyDetails", () => () => (
  <div data-testid="company-details">Company Details Component</div>
));

jest.mock("@/components/recruiter/forms/Profile", () => () => (
  <div data-testid="profile">Profile Component</div>
));

jest.mock("@/components/recruiter/forms/NextCybrProfile", () => () => (
  <div data-testid="nextcybr-profile">NextCybr Profile Component</div>
));


jest.mock("@/components/recruiter/ProfileTabs", () => (props) => (
  <div>
    <button onClick={() => props.onChange("company")}>Company Tab</button>
    <button onClick={() => props.onChange("profile")}>Profile Tab</button>
    <button onClick={() => props.onChange("nextcybr")}>NextCybr Tab</button>
  </div>
));

describe("RecruiterProfilePage", () => {
  test("renders CompanyDetails by default", () => {
    render(<RecruiterProfilePage />);

    expect(
      screen.getByTestId("company-details")
    ).toBeInTheDocument();

    expect(
      screen.queryByTestId("profile")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId("nextcybr-profile")
    ).not.toBeInTheDocument();
  });

  test("switches to Profile tab when clicked", () => {
    render(<RecruiterProfilePage />);

    fireEvent.click(screen.getByText("Profile Tab"));

    expect(screen.getByTestId("profile")).toBeInTheDocument();
    expect(
      screen.queryByTestId("company-details")
    ).not.toBeInTheDocument();
  });

  test("switches to NextCybr tab when clicked", () => {
    render(<RecruiterProfilePage />);

    fireEvent.click(screen.getByText("NextCybr Tab"));

    expect(
      screen.getByTestId("nextcybr-profile")
    ).toBeInTheDocument();

    expect(
      screen.queryByTestId("company-details")
    ).not.toBeInTheDocument();
  });

  test("only one tab content renders at a time", () => {
    render(<RecruiterProfilePage />);

    fireEvent.click(screen.getByText("Profile Tab"));

    expect(screen.getByTestId("profile")).toBeInTheDocument();
    expect(screen.queryByTestId("company-details")).toBeNull();
    expect(screen.queryByTestId("nextcybr-profile")).toBeNull();
  });
});