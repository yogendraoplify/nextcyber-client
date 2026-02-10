import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExperienceModal from "@/components/modal/ExperienceModal";

// ✅ Mock helper
jest.mock("@/helper", () => ({
  timeFormatter: jest.fn(),
}));

import { timeFormatter } from "@/helper";

describe("ExperienceModal", () => {
  const mockOnClose = jest.fn();

  const mockData = [
    {
      startDate: "2021-01-01",
      endDate: "2022-01-01",
      jobTitle: "Frontend Developer",
      companyName: "OpenAI",
      description: <li>Worked on UI components</li>,
    },
    {
      startDate: "2019-01-01",
      endDate: "2020-01-01",
      level: "Bachelor's Degree",
      institute: "MIT",
      description: <li>Computer Science</li>,
    },
  ];

  const setup = (props = {}) => {
    timeFormatter.mockImplementation((date) => `formatted-${date}`);

    return render(
      <ExperienceModal
        isOpen={true}
        onClose={mockOnClose}
        data={mockData}
        {...props}
      />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders modal title", () => {
    setup();

    expect(screen.getByText("Experience")).toBeInTheDocument();
  });

  test("renders experience items from data", () => {
    setup();

    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("OpenAI")).toBeInTheDocument();

    expect(screen.getByText("Bachelor's Degree")).toBeInTheDocument();
    expect(screen.getByText("MIT")).toBeInTheDocument();
  });

  test("formats start and end dates using timeFormatter", () => {
    setup();

    expect(timeFormatter).toHaveBeenCalledWith("2021-01-01");
    expect(timeFormatter).toHaveBeenCalledWith("2022-01-01");
    expect(timeFormatter).toHaveBeenCalledTimes(4); // 2 entries × 2 dates
  });

  test("renders descriptions correctly", () => {
    setup();

    expect(screen.getByText("Worked on UI components")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    setup();

    fireEvent.click(screen.getByRole("button"));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when Escape key is pressed", () => {
    setup();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("does not attach Escape listener when isOpen is false", () => {
    render(
      <ExperienceModal
        isOpen={false}
        onClose={mockOnClose}
        data={mockData}
      />
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("stops click propagation inside scroll container", () => {
    setup();

    const scrollContainer = document.querySelector(".exp-scroll");

    fireEvent.click(scrollContainer);

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});