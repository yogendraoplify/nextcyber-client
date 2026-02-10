import React from "react";
import { render, screen } from "@testing-library/react";
import TermsOfUse from "@/components/TermsAndCondition";

describe("TermsOfUse component", () => {
  test("renders main page heading", () => {
    render(<TermsOfUse />);

    expect(
      screen.getByRole("heading", {
        name: /nextcybr terms of use/i,
        level: 1,
      })
    ).toBeInTheDocument();
  });

  test("renders introductory paragraph", () => {
    render(<TermsOfUse />);

    expect(
      screen.getByText(/these terms of use.*govern your access/i)
    ).toBeInTheDocument();
  });

  test("renders all section titles", () => {
    render(<TermsOfUse />);

    const titles = [
      "1. Parties & Acceptance",
      "2. Eligibility",
      "3. Account Registration & Responsibilities",
      "4. User Roles & Permissions",
      "5. Payments, Subscriptions & Fees",
      "6. Cancellations & Refunds",
      "7. User Conduct",
      "8. Limitation of Liability",
      "9. Intellectual Property",
      "10. AI & Recommendation Disclaimer",
      "11. Governing Law & Dispute Resolution",
      "12. Modifications",
      "AI Transparency (Additional Clause)",
    ];

    titles.forEach((title) => {
      expect(
        screen.getByRole("heading", { name: title })
      ).toBeInTheDocument();
    });
  });

  test("renders list items for sections with list data", () => {
    render(<TermsOfUse />);

    // Representative list items (not all)
    expect(
      screen.getByText(/you must be at least 13 years old/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/payments are processed through third-party/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/reverse engineer or tamper/i)
    ).toBeInTheDocument();
  });

  test("renders paragraph content for sections with content data", () => {
    render(<TermsOfUse />);

    expect(
      screen.getByText("these terms are a binding agreement", { exact: false })
    ).toBeInTheDocument();

  
  });

  test("renders AI Transparency additional clause content", () => {
    render(<TermsOfUse />);

    expect(
      screen.getByText(/nextcybr uses ai to provide recommendations/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/ai suggestions are for informational purposes only/i)
    ).toBeInTheDocument();
  });

  test("renders correct number of section headings", () => {
    render(<TermsOfUse />);

    // All section titles are h4
    const sectionHeadings = screen.getAllByRole("heading", { level: 4 });
    expect(sectionHeadings.length).toBe(13);
  });
});