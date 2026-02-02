import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import JobDetailsModal from "@/components/modal/JobDetailsModal";

/* =====================================================
   MOCK NEXT/IMAGE
===================================================== */
jest.mock("next/image", () => (props) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt} />;
});

/* =====================================================
   MOCK TIME FORMATTER
===================================================== */
jest.mock("@/helper", () => ({
  timeFormatter: jest.fn(() => "2 days ago"),
}));

/* =====================================================
   MOCK DATA
===================================================== */
const mockJob = {
  id: "job-1",
  title: "Frontend Developer",
  contractType: "FULLTIME",
  minWorkExperience: 2,
  maxWorkExperience: 5,
  maxSalary: "₹12 LPA",
  createdAt: "2025-01-01",
  jobDescription: "<p>This is a frontend role.</p>",
  certifications: ["AWS", "React"],
  skills: ["JavaScript", "React", "CSS"],
  company: {
    companyName: "OpenAI",
    profilePicture: {
      url: "/logo.png",
    },
  },
};

/* =====================================================
   TEST SUITE
===================================================== */

describe("JobDetailsModal Component", () => {
  test("renders job title and company name", () => {
    render(
      <JobDetailsModal
        selectedJob={mockJob}
        onClose={jest.fn()}
        applyJob={jest.fn()}
      />
    );

    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();

    expect(screen.getByText("OpenAI")).toBeInTheDocument();
  });

  test("renders job metadata", () => {
    render(
      <JobDetailsModal
        selectedJob={mockJob}
        onClose={jest.fn()}
        applyJob={jest.fn()}
      />
    );

    expect(screen.getByText("fulltime")).toBeInTheDocument();
    expect(screen.getByText("2-5 Years")).toBeInTheDocument();
    expect(screen.getByText("₹12 LPA")).toBeInTheDocument();
    expect(screen.getByText("Posted on 2 days ago")).toBeInTheDocument();
  });

  test("renders job description HTML", () => {
    render(
      <JobDetailsModal
        selectedJob={mockJob}
        onClose={jest.fn()}
        applyJob={jest.fn()}
      />
    );

    expect(screen.getByText("This is a frontend role.")).toBeInTheDocument();
  });


  test("renders required skills", () => {
    render(
      <JobDetailsModal
        selectedJob={mockJob}
        onClose={jest.fn()}
        applyJob={jest.fn()}
      />
    );

    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("CSS")).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();

    render(
      <JobDetailsModal
        selectedJob={mockJob}
        onClose={onClose}
        applyJob={jest.fn()}
      />
    );

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(onClose).toHaveBeenCalled();
  });

  test("calls applyJob with job id when Apply Now is clicked", () => {
    const applyJob = jest.fn();

    render(
      <JobDetailsModal
        selectedJob={mockJob}
        onClose={jest.fn()}
        applyJob={applyJob}
      />
    );

    fireEvent.click(screen.getByText("Apply Now"));

    expect(applyJob).toHaveBeenCalledWith("job-1");
  });
});
