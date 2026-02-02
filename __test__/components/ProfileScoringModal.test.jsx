import React from "react";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfileScoringModal from "@/components/modal/ProfileScoreModal";

/* =====================================================
   MOCK DATA
===================================================== */

const mockData = {
  overallPercentage: 56,
  sections: {
    accountDetails: {
      percentage: 40,
      items: [
        {
          key: "profilePicture",
          label: "Profile Picture",
          weight: 14,
          completed: true,
        },
        {
          key: "location",
          label: "Location",
          weight: 6,
          completed: false,
        },
      ],
    },
    profile: {
      percentage: 30,
      items: [
        {
          key: "bio",
          label: "Bio",
          weight: 15,
          completed: true,
        },
      ],
    },
    technical: {
      percentage: 26,
      items: [
        {
          key: "skills",
          label: "Skills",
          weight: 26,
          completed: false,
        },
      ],
    },
  },
};

/* =====================================================
   TEST SUITE
===================================================== */

describe("ProfileScoringModal Component", () => {
  /* ---------- CONDITIONAL RENDER ---------- */

  test("does not render when isOpen is false", () => {
    const { container } = render(
      <ProfileScoringModal
        isOpen={false}
        data={mockData}
        onClose={jest.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test("does not render when data is missing", () => {
    const { container } = render(
      <ProfileScoringModal
        isOpen={true}
        data={null}
        onClose={jest.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  /* ---------- BASIC RENDER ---------- */

  test("renders modal title and overall percentage", () => {
    render(
      <ProfileScoringModal
        isOpen={true}
        data={mockData}
        onClose={jest.fn()}
      />
    );

    expect(
      screen.getByText("Profile Scoring Model")
    ).toBeInTheDocument();

    expect(
      screen.getByText("56%")
    ).toBeInTheDocument();
  });

  /* ---------- SECTIONS ---------- */

  test("renders section titles and items", () => {
    render(
      <ProfileScoringModal
        isOpen={true}
        data={mockData}
        onClose={jest.fn()}
      />
    );

    // Section titles
    expect(
      screen.getByText("Account Details")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Profile")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Technical")
    ).toBeInTheDocument();

    // Section items
    expect(
      screen.getByText("Profile Picture")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Location")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Skills")
    ).toBeInTheDocument();
  });

  /* ---------- CLOSE ACTIONS ---------- */

  test("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();

    render(
      <ProfileScoringModal
        isOpen={true}
        data={mockData}
        onClose={onClose}
      />
    );

    fireEvent.click(
      screen.getAllByRole("button")[0]
    );

    expect(onClose).toHaveBeenCalled();
  });

  test("calls onClose when backdrop is clicked", () => {
    const onClose = jest.fn();

    render(
      <ProfileScoringModal
        isOpen={true}
        data={mockData}
        onClose={onClose}
      />
    );

    fireEvent.click(
      screen.getByText("Profile Scoring Model")
        .closest(".fixed")
    );

    expect(onClose).toHaveBeenCalled();
  });

  test("calls onClose when Escape key is pressed", () => {
    const onClose = jest.fn();

    render(
      <ProfileScoringModal
        isOpen={true}
        data={mockData}
        onClose={onClose}
      />
    );

    fireEvent.keyDown(document, {
      key: "Escape",
      code: "Escape",
    });

    expect(onClose).toHaveBeenCalled();
  });
});
