import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CompanyCard from "@/components/cards/CompanyCard";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

jest.mock("next/link", () => {
  return ({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

jest.mock("@/components/QuillContentViewer", () => {
  return ({ html }) => <div data-testid="quill-viewer">{html}</div>;
});

const mockCompany = {
  id: "company-1",
  companyName: "OpenAI",
  companyTagline: "Building safe AGI",
  about: "<p>We research artificial intelligence.</p>",
  headquarter: "San Francisco",
  companySize: 500,
  profilePicture: {
    url: "https://example.com/logo.png",
  },
};

describe("CompanyCard Component", () => {
  test("renders company name and tagline", () => {
    render(<CompanyCard company={mockCompany} />);

    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(screen.getByText("Building safe AGI")).toBeInTheDocument();
  });

  test("renders company logo when profile picture exists", () => {
    render(<CompanyCard company={mockCompany} />);

    const logo = screen.getByAltText("OpenAI logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", mockCompany.profilePicture.url);
  });

  test("renders fallback logo when profile picture is missing", () => {
    render(<CompanyCard company={{ ...mockCompany, profilePicture: null }} />);

    expect(screen.getByText("dyson")).toBeInTheDocument();
  });

  test("renders company about content using QuillContentViewer", () => {
    render(<CompanyCard company={mockCompany} />);

    const quillContent = screen.getByTestId("quill-viewer");
    expect(quillContent).toBeInTheDocument();
    expect(quillContent.innerHTML).toContain(
      "We research artificial intelligence."
    );
  });

  test("renders default about text when about is missing", () => {
    render(<CompanyCard company={{ ...mockCompany, about: null }} />);

    expect(
      screen.getByText(/Google LLC is an American multinational/i)
    ).toBeInTheDocument();
  });

  test("renders company location and size", () => {
    render(<CompanyCard company={mockCompany} />);

    expect(screen.getByText("San Francisco")).toBeInTheDocument();
    expect(screen.getByText("500+")).toBeInTheDocument();
  });

  test("renders open jobs link with correct href", () => {
    render(<CompanyCard company={mockCompany} />);

    const jobsLink = screen.getByText("124 Open Jobs").closest("a");

    expect(jobsLink).toHaveAttribute("href", `/companies/${mockCompany.id}`);
  });

  test("renders website (globe) button", () => {
    render(<CompanyCard company={mockCompany} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
