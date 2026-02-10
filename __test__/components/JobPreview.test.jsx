import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import JobPreview from "@/components/jobs/JobPreview";
import { useSelector } from "react-redux";

// ✅ Mock redux
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// ✅ Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("JobPreview", () => {
  const mockCompanyProfile = {
    companyName: "OpenAI",
    profilePicture: {
      url: "/logo.png",
    },
  };

  const mockData = {
    contractType: "FULLTIME",
    minWorkExperience: 2,
    maxWorkExperience: 5,
    maxSalary: "₹15 LPA",
    createdAt: "2024-01-15T00:00:00.000Z",
    title: "Security Analyst",
    jobDescription: "Responsible for monitoring security systems.",
    certifications: ["CEH", "Security+"],
    skills: ["Networking", "Incident Response"],
  };

  beforeEach(() => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        auth: {
          user: {
            companyProfile: mockCompanyProfile,
          },
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders company name and logo", () => {
    render(<JobPreview data={mockData} />);

    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(screen.getByAltText("company-logo")).toBeInTheDocument();
  });

  test("renders job metadata correctly", () => {
    render(<JobPreview data={mockData} />);

    expect(screen.getByText("fulltime")).toBeInTheDocument();
    expect(screen.getByText("2-5 Years")).toBeInTheDocument();
    expect(screen.getByText("₹15 LPA")).toBeInTheDocument();
    expect(
      screen.getByText(/Posted on 15 Jan 2024/)
    ).toBeInTheDocument();
  });

  test("renders job title and description", () => {
    render(<JobPreview data={mockData} />);

    expect(screen.getByText("Security Analyst")).toBeInTheDocument();
    expect(
      screen.getByText("Responsible for monitoring security systems.")
    ).toBeInTheDocument();
  });

  test("renders certifications when provided", () => {
    render(<JobPreview data={mockData} />);

    expect(screen.getByText("CEH")).toBeInTheDocument();
    expect(screen.getByText("Security+")).toBeInTheDocument();
  });

  test("renders required skills list", () => {
    render(<JobPreview data={mockData} />);

    expect(screen.getByText("Networking")).toBeInTheDocument();
    expect(screen.getByText("Incident Response")).toBeInTheDocument();
  });

  test("handles missing certifications and skills gracefully", () => {
    render(
      <JobPreview
        data={{
          ...mockData,
          certifications: undefined,
          skills: undefined,
        }}
      />
    );

    expect(screen.queryByText("CEH")).not.toBeInTheDocument();
    expect(screen.queryByText("Networking")).not.toBeInTheDocument();
  });

  test("uses fallback image when company profile picture is missing", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        auth: {
          user: {
            companyProfile: {
              companyName: "OpenAI",
              profilePicture: null,
            },
          },
        },
      })
    );

    render(<JobPreview data={mockData} />);

    const image = screen.getByAltText("company-logo");
    expect(image).toHaveAttribute("src", "/image.png");
  });
});