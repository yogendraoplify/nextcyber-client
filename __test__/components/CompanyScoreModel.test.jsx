import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CompanyScoreModel from "@/components/modal/CompanyScoreModel";

describe("CompanyScoreModel", () => {
  const mockOnClose = jest.fn();

  const mockProfileScore = {
    overallPercentage: 65,
    sectionPercentages: {
      accountDetails: 30,
      profile: 27,
      cyber: 45,
    },
  };

  const setup = (props = {}) => {
    return render(
      <CompanyScoreModel
        isOpen={true}
        onClose={mockOnClose}
        profileScore={mockProfileScore}
        {...props}
      />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns null when isOpen is false", () => {
    render(
      <CompanyScoreModel
        isOpen={false}
        onClose={mockOnClose}
        profileScore={mockProfileScore}
      />
    );

    expect(
      screen.queryByText("Profile Scoring Model")
    ).not.toBeInTheDocument();
  });

  test("returns null when profileScore is missing", () => {
    render(
      <CompanyScoreModel isOpen={true} onClose={mockOnClose} />
    );

    expect(
      screen.queryByText("Profile Scoring Model")
    ).not.toBeInTheDocument();
  });

  test("renders modal title", () => {
    setup();

    expect(
      screen.getByText("Profile Scoring Model")
    ).toBeInTheDocument();
  });

  test("renders overall percentage value", () => {
    setup();

    expect(screen.getByText("65%")).toBeInTheDocument();
  });

  test("renders all section titles", () => {
    setup();

    expect(screen.getByText("Account Details")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Cyber Security")).toBeInTheDocument();
  });

  test("renders section percentages correctly", () => {
    setup();

    expect(screen.getByText("30%")).toBeInTheDocument();
    expect(screen.getByText("27%")).toBeInTheDocument();
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  test("renders section items labels", () => {
    setup();

    expect(screen.getByText("Company Name")).toBeInTheDocument();
    expect(screen.getByText("Industry")).toBeInTheDocument();
    expect(screen.getByText("Company Description")).toBeInTheDocument();
    expect(screen.getByText("Security Policy")).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    setup();

    fireEvent.click(screen.getByRole("button"));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when clicking the backdrop", () => {
    setup();

    fireEvent.click(
      screen.getByText("Profile Scoring Model").closest(".fixed")
    );

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("does NOT call onClose when clicking inside modal", () => {
    setup();

    fireEvent.click(screen.getByText("Account Details"));

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("calls onClose when Escape key is pressed", () => {
    setup();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("does not react to Escape when modal is closed", () => {
    render(
      <CompanyScoreModel
        isOpen={false}
        onClose={mockOnClose}
        profileScore={mockProfileScore}
      />
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});