import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import StudentCard from "@/components/cards/StudentCard";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

jest.mock("@/helper", () => ({
  currencyFormatter: jest.fn((value) => `${value}`),
}));

import { currencyFormatter } from "@/helper";

const mockCandidate = {
  id: "1",
  profilePicture: {
    url: "https://example.com/profile.jpg",
  },
  user: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  },
  role: "Frontend Developer",
  contractType: "FULL_TIME",
  expectedSalary: 120000,
  hourlyRate: 50,
  workExperienceInYears: 3,
};

describe("StudentCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders candidate name and role", () => {
    render(<StudentCard candidate={mockCandidate} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
  });

  test("renders candidate profile image with correct alt text", () => {
    render(<StudentCard candidate={mockCandidate} />);

    const image = screen.getByAltText("John Doe");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockCandidate.profilePicture.url);
  });

  test("shows expected salary for full-time candidate", () => {
    render(<StudentCard candidate={mockCandidate} />);

    expect(currencyFormatter).toHaveBeenCalledWith(
      mockCandidate.expectedSalary
    );

    expect(screen.getByText("120000")).toBeInTheDocument();
  });

  test("shows hourly rate for freelance candidate", () => {
    render(
      <StudentCard
        candidate={{
          ...mockCandidate,
          contractType: "FREELANCE",
        }}
      />
    );

    expect(currencyFormatter).toHaveBeenCalledWith(mockCandidate.hourlyRate);

    expect(screen.getByText("50")).toBeInTheDocument();
  });

  test("renders work experience", () => {
    render(<StudentCard candidate={mockCandidate} />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("calls handleFavoriteToggle when favorite button clicked", () => {
    const handleFavoriteToggle = jest.fn();

    render(
      <StudentCard
        candidate={mockCandidate}
        handleFavoriteToggle={handleFavoriteToggle}
        isFavorite={false}
      />
    );

    const favoriteButton = screen.getAllByRole("button")[0];
    fireEvent.click(favoriteButton);

    expect(handleFavoriteToggle).toHaveBeenCalledTimes(1);
  });

  test("renders favorite state correctly", () => {
    render(
      <StudentCard
        candidate={mockCandidate}
        handleFavoriteToggle={jest.fn()}
        isFavorite={true}
      />
    );

    const heartIcon = screen.getAllByRole("button")[0].querySelector("svg");

    expect(heartIcon).toHaveClass("fill-primary-2-light");
  });

  test("renders Chat and Profile buttons", () => {
    render(<StudentCard candidate={mockCandidate} />);

    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });
});
