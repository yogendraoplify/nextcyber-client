import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { FormProvider, useForm } from "react-hook-form";
import TechnicalForm from "@/components/profile/steps/TechnicalForm";
import dropdownReducer from "@/store/slices/dropdownSlice";
import { asyncGetDropdown } from "@/store/actions/dropdownAction";


jest.mock("@/store/actions/dropdownAction", () => ({
  asyncGetDropdown: jest.fn(() => ({ type: "GET_SKILLS" })),
}));

jest.mock("@/components/SelectField", () => ({
  __esModule: true,
  default: ({ label, name }) => (
    <div>
      <label>{label}</label>
      <select data-testid={name} multiple />
    </div>
  ),
}));


const renderWithProviders = (
  ui,
  {
    preloadedState = {
      dropdown: { skillsDropdown: [] },
    },
  } = {}
) => {
  const store = configureStore({
    reducer: {
      dropdown: dropdownReducer,
    },
    preloadedState,
  });

  const Wrapper = ({ children }) => {
    const methods = useForm({
      defaultValues: {
        contractType: "",
        remotePolicy: "",
        skills: [],
        certificates: [],
      },
    });

    return (
      <Provider store={store}>
        <FormProvider {...methods}>{children}</FormProvider>
      </Provider>
    );
  };

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  };
};


describe("TechnicalForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders contract type buttons", () => {
    renderWithProviders(<TechnicalForm />);

    expect(screen.getByText("freelance")).toBeInTheDocument();
    expect(screen.getByText("internship")).toBeInTheDocument();
    expect(screen.getByText("temporary")).toBeInTheDocument();
    expect(screen.getByText("permanent")).toBeInTheDocument();
  });

  test("sets contract type on button click", () => {
    renderWithProviders(<TechnicalForm />);

    const freelanceBtn = screen.getByText("freelance");
    fireEvent.click(freelanceBtn);

    expect(freelanceBtn).toHaveClass("text-white");
  });

  test("sets remote policy on button click", () => {
    renderWithProviders(<TechnicalForm />);

    const remoteBtn = screen.getByText("remote");
    fireEvent.click(remoteBtn);

    expect(remoteBtn).toHaveClass("text-white");
  });

  test("dispatches asyncGetDropdown if skillsDropdown is empty", () => {
    renderWithProviders(<TechnicalForm />);

    expect(asyncGetDropdown).toHaveBeenCalledWith({ name: "skills" });
    expect(asyncGetDropdown).toHaveBeenCalledTimes(1);
  });

  test("does NOT dispatch asyncGetDropdown if skillsDropdown already exists", () => {
    renderWithProviders(<TechnicalForm />, {
      preloadedState: {
        dropdown: {
          skillsDropdown: ["React", "Node"],
        },
      },
    });

    expect(asyncGetDropdown).not.toHaveBeenCalled();
  });

  test("renders SelectField components", () => {
    renderWithProviders(<TechnicalForm />);

    expect(screen.getByText("Certificates")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
  });
});