import React from "react";
import { render, screen } from "@testing-library/react";
import TipsCard from "@/components/TipsCard";

describe("TipsCard component", () => {
  test("renders Tips heading", () => {
    render(<TipsCard tips={["Tip 1"]} />);

    expect(
      screen.getByRole("heading", { name: "Tips" })
    ).toBeInTheDocument();
  });

  test("renders all tips provided", () => {
    const tips = ["Use strong passwords", "Enable 2FA", "Update regularly"];

    render(<TipsCard tips={tips} />);

    tips.forEach((tip) => {
      expect(screen.getByText(tip)).toBeInTheDocument();
    });
  });

  test("renders correct number of list items", () => {
    const tips = ["Tip A", "Tip B", "Tip C"];

    render(<TipsCard tips={tips} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(tips.length);
  });

  test("handles empty tips array gracefully", () => {
    render(<TipsCard tips={[]} />);

    expect(screen.getByRole("heading", { name: "Tips" })).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});