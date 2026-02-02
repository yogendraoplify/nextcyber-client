import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import JobCard from "@/components/cards/JobCard";
import { currencyFormatter, timeFormatter } from "@/helper";


jest.mock("@/helper", () => ({
  currencyFormatter: jest.fn((value) => `$${value}`),
  timeFormatter: jest.fn(() => "2 days ago"),
}));



const mockJob = {
  id: "job-1",
  title: "Frontend Developer",
  location: "Bangalore, India",
  contractType: "FULL_TIME",
  minWorkExperience: 2,
  maxWorkExperience: 5,
  maxSalary: 120000,
  createdAt: "2024-01-01T00:00:00.000Z",
  company: {
    companyName: "OpenAI",
  },
};


describe("JobCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test("renders company name and job title", () => {
    render(<JobCard job={mockJob} handleClick={jest.fn()} />);

    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(
      screen.getByText("Frontend Developer")
    ).toBeInTheDocument();
  });


  test("renders formatted posted date", () => {
    render(<JobCard job={mockJob} handleClick={jest.fn()} />);

    expect(timeFormatter).toHaveBeenCalledWith(
      mockJob.createdAt
    );
    expect(
      screen.getByText("Posted on 2 days ago")
    ).toBeInTheDocument();
  });


  test("renders job location", () => {
    render(<JobCard job={mockJob} handleClick={jest.fn()} />);

    expect(
      screen.getByText("Bangalore, India")
    ).toBeInTheDocument();
  });


  test("renders contract type and experience range", () => {
    render(<JobCard job={mockJob} handleClick={jest.fn()} />);

    expect(screen.getByText("FULL_TIME")).toBeInTheDocument();
    expect(
      screen.getByText("2-5 Years")
    ).toBeInTheDocument();
  });


  test("renders formatted salary", () => {
    render(<JobCard job={mockJob} handleClick={jest.fn()} />);

    expect(currencyFormatter).toHaveBeenCalledWith(
      mockJob.maxSalary
    );

    expect(screen.getByText("$120000")).toBeInTheDocument();
  });


  test("renders Featured and Urgent badges", () => {
    render(<JobCard job={mockJob} handleClick={jest.fn()} />);

    expect(screen.getByText("Featured")).toBeInTheDocument();
    expect(screen.getByText("Urgent")).toBeInTheDocument();
  });


  test("renders Apply Now and Share buttons", () => {
    render(<JobCard job={mockJob} handleClick={jest.fn()} />);

    expect(screen.getByText("Apply Now")).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(1);
  });


  test("calls handleClick with job data when card is clicked", () => {
    const handleClick = jest.fn();

    render(<JobCard job={mockJob} handleClick={handleClick} />);

    fireEvent.click(
      screen.getByText("Frontend Developer")
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockJob);
  });


  test("renders fallback company and title when data is missing", () => {
    render(
      <JobCard
        job={{}}
        handleClick={jest.fn()}
      />
    );

    expect(
      screen.getByText("Unknown Company")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Job Title Here")
    ).toBeInTheDocument();
  });
});
