import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Footer from "@/components/Footer";
import "@testing-library/jest-dom";

jest.mock("next/image", () => (props) => {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...props} />;
});

jest.mock("next/link", () => {
  return ({ href, children, ...rest }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

describe("Footer component", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders footer content correctly", () => {
    render(<Footer />);

    expect(
      screen.getByText(
        /where tech founders hire great developers really fast/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByAltText("nextcybr-logo")).toBeInTheDocument();
  });

  test("renders social media links", () => {
    render(<Footer />);

    expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByLabelText("Instagram")).toBeInTheDocument();
    expect(screen.getByLabelText("Twitter")).toBeInTheDocument();
  });

  test("renders website links", () => {
    render(<Footer />);

    ["Freelancer", "Candidate", "Company", "Mentorship", "About Us"].forEach(
      (text) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      },
    );
  });

  test("renders resource links", () => {
    render(<Footer />);

    ["Privacy Policy", "Terms Of Use", "Blogs", "Events"].forEach((text) => {
      expect(screen.getAllByText(text)[0]).toBeInTheDocument();
    });
  });

  test("updates email input value on change", () => {
    render(<Footer />);

    const input = screen.getByPlaceholderText("Your Email Address");

    fireEvent.change(input, { target: { value: "test@example.com" } });

    expect(input.value).toBe("test@example.com");
  });

 

  test("submits valid email and clears input", () => {
    render(<Footer />);

    const input = screen.getByPlaceholderText("Your Email Address");
    const submitBtn = screen.getByRole("button", {
      name: /submit email/i,
    });

    fireEvent.change(input, { target: { value: "user@test.com" } });
    fireEvent.click(submitBtn);

    expect(console.log).toHaveBeenCalledWith(
      "Email submitted:",
      "user@test.com",
    );

    expect(input.value).toBe("");
  });

  test("renders footer bottom legal links", () => {
    render(<Footer />);

    expect(
      screen.getByText("©2025 NextCybr. All Rights Reserved."),
    ).toBeInTheDocument();

    expect(screen.getAllByText("Privacy Policy").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Terms & Conditions").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cookie Policy").length).toBeGreaterThan(0);
  });
});
