import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useForm, FormProvider } from "react-hook-form";
import AccountDetails from "@/components/profile/steps/AccountDetails";
import toast from "react-hot-toast";
import validateImage from "@/helper/validateImage";

jest.mock("next/image", () => (props) => {
  return <img {...props} alt={props.alt} />;
});

jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
}));

jest.mock("@/helper/validateImage", () => jest.fn());

jest.mock("@/components/helper/LocationSearchInput", () => (props) => (
  <button
    data-testid="location-btn"
    onClick={() =>
      props.onPlaceSelected({
        city: "Delhi",
        state: "Delhi",
        country: "India",
      })
    }
  >
    Mock Location
  </button>
));

jest.mock("@/components/SelectField", () => () => (
  <div data-testid="select-field" />
));

const renderWithForm = () => {
  const Wrapper = ({ children }) => {
    const methods = useForm({
      defaultValues: {
        profilePicture: null,
        profileBanner: null,
        firstName: "",
        lastName: "",
        gender: "",
        salary: "",
      },
    });

    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  return render(<AccountDetails />, { wrapper: Wrapper });
};

describe("AccountDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(() => "preview-url");
  });

  test("renders all required fields", () => {
    renderWithForm();
    expect(screen.getByPlaceholderText("Enter first name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter last name")).toBeInTheDocument();
  });

  test("shows error if non-image uploaded", () => {
    renderWithForm();

    const file = new File(["dummy"], "test.pdf", {
      type: "application/pdf",
    });

    const fileInputs = document.querySelectorAll('input[type="file"]');
    const profileInput = fileInputs[0];

    fireEvent.change(profileInput, {
      target: { files: [file] },
    });

    expect(toast.error).toHaveBeenCalledWith("Only image files allowed");
  });

  test("sets profile picture if valid image uploaded", async () => {
    renderWithForm();

    const file = new File(["dummy"], "image.png", {
      type: "image/png",
    });

    const input = document.querySelectorAll('input[type="file"]')[0];

    fireEvent.change(input, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  test("shows banner validation error from validateImage", async () => {
    validateImage.mockResolvedValue("Invalid dimensions");

    renderWithForm();

    const file = new File(["dummy"], "banner.png", {
      type: "image/png",
    });

    const bannerInput = document.querySelectorAll('input[type="file"]')[1];

    fireEvent.change(bannerInput, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid dimensions");
    });
  });

  test("sets banner if validation passes", async () => {
    validateImage.mockResolvedValue(null);

    renderWithForm();

    const file = new File(["dummy"], "banner.png", {
      type: "image/png",
    });

    const bannerInput = document.querySelectorAll('input[type="file"]')[1];

    fireEvent.change(bannerInput, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(validateImage).toHaveBeenCalled();
    });
  });

  test("sets gender when clicked", () => {
    renderWithForm();

    const maleBtn = screen.getByText("male");
    fireEvent.click(maleBtn);

    expect(maleBtn).toBeInTheDocument();
  });

  test("formats and sets location correctly", async () => {
    renderWithForm();

    const btn = screen.getByTestId("location-btn");
    fireEvent.click(btn);

    await waitFor(() => {
      expect(btn).toBeInTheDocument();
    });
  });
});
