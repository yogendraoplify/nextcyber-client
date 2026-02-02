import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SaveButton } from "@/components/ui/SaveButton";

describe("SaveButton Component", () => {

  test("renders default save text", () => {
    render(<SaveButton />);

    expect(
      screen.getByRole("button", { name: "Save" })
    ).toBeInTheDocument();
  });


  test("renders custom button text", () => {
    render(<SaveButton text="Submit" />);

    expect(
      screen.getByRole("button", { name: "Submit" })
    ).toBeInTheDocument();
  });


  test("renders loading text and disables button when loading", () => {
    render(
      <SaveButton
        isLoading={true}
        loadingText="Saving..."
      />
    );

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(
      screen.getByText("Saving...")
    ).toBeInTheDocument();
  });

  test("renders loader icon when loading", () => {
    render(<SaveButton isLoading={true} />);

    expect(
      document.querySelector("svg.lucide-loader-circle")
    ).toBeInTheDocument();
  });


  test("uses provided button type", () => {
    render(<SaveButton type="submit" />);

    expect(
      screen.getByRole("button")
    ).toHaveAttribute("type", "submit");
  });
});
