import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import LocationSearchInput from "@/components/helper/LocationSearchInput";

const getPlacePredictionsMock = jest.fn();
const getDetailsMock = jest.fn();

jest.mock("react-google-autocomplete/lib/usePlacesAutocompleteService", () => {
  return () => ({
    placesService: {
      getDetails: getDetailsMock,
    },
    placePredictions: [
      {
        place_id: "place-1",
        description: "Bangalore, Karnataka, India",
      },
    ],
    getPlacePredictions: getPlacePredictionsMock,
    isPlacePredictionsLoading: false,
  });
});

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("LocationSearchInput", () => {
  test("renders input field", () => {
    render(<LocationSearchInput />);

    expect(screen.getByPlaceholderText("Search city")).toBeInTheDocument();
  });

  test("calls getPlacePredictions after debounce", async () => {
    render(<LocationSearchInput />);

    const input = screen.getByPlaceholderText("Search city");

    fireEvent.change(input, {
      target: { value: "Ban" },
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(getPlacePredictionsMock).toHaveBeenCalledWith({
      input: "Ban",
      types: ["(cities)"],
    });
  });

  test("shows dropdown with predictions", () => {
    render(<LocationSearchInput />);

    const input = screen.getByPlaceholderText("Search city");

    fireEvent.change(input, {
      target: { value: "Bangalore" },
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByText("Bangalore, Karnataka, India")).toBeInTheDocument();
  });

  test("selects a place and calls onPlaceSelected", () => {
    const onPlaceSelected = jest.fn();

    getDetailsMock.mockImplementation((_, callback) => {
      callback({
        address_components: [
          {
            long_name: "Bangalore",
            types: ["locality"],
          },
          {
            long_name: "Karnataka",
            types: ["administrative_area_level_1"],
          },
          {
            long_name: "India",
            types: ["country"],
          },
        ],
      });
    });

    render(<LocationSearchInput onPlaceSelected={onPlaceSelected} />);

    const input = screen.getByPlaceholderText("Search city");

    fireEvent.change(input, {
      target: { value: "Bangalore" },
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    fireEvent.click(screen.getByText("Bangalore, Karnataka, India"));

    expect(onPlaceSelected).toHaveBeenCalledWith({
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
    });

    expect(input.value).toBe("Bangalore, Karnataka, India");
  });

  test("clears input when X icon is clicked", () => {
    const onPlaceSelected = jest.fn();

    render(
      <LocationSearchInput
        value="Delhi, India"
        onPlaceSelected={onPlaceSelected}
      />
    );

    const input = screen.getByPlaceholderText("Search city");
    expect(input.value).toBe("Delhi, India");

    const clearIcon = document.querySelector("svg.lucide-x");
    fireEvent.click(clearIcon);

    expect(input.value).toBe("");
    expect(onPlaceSelected).toHaveBeenCalledWith({});
  });

  test("calls clearOnUnmount on unmount when value exists", () => {
    const clearOnUnmount = jest.fn();

    const { unmount } = render(
      <LocationSearchInput value="Mumbai" clearOnUnmount={clearOnUnmount} />
    );

    unmount();

    expect(clearOnUnmount).toHaveBeenCalled();
  });
});
