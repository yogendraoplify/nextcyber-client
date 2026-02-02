"use client";

import { ChevronDown, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

export default function LocationSearchInput({
  value,
  onPlaceSelected,
  clearOnUnmount,
  handleClear = () => {},
}) {
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [searchValue, setSearchValue] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  const searchTermRef = useRef(searchValue);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const extractLocation = useCallback(
    (placeDetails) => {
      if (!placeDetails?.address_components) return;

      const getComponent = (type) =>
        placeDetails.address_components.find((c) => c.types.includes(type))
          ?.long_name || "";

      const locationData = {
        city:
          getComponent("locality") ||
          getComponent("administrative_area_level_2"),
        state: getComponent("administrative_area_level_1"),
        country: getComponent("country"),
      };

      onPlaceSelected?.(locationData);

      setSelectedLocation(
        [locationData.city, locationData.state, locationData.country]
          .filter(Boolean)
          .join(", ")
      );
      setSearchValue(
        [locationData.city, locationData.state, locationData.country]
          .filter(Boolean)
          .join(", ")
      );
    },
    [onPlaceSelected]
  );

  const handleSelect = (placeId) => {
    if (!placesService) return;

    placesService.getDetails(
      {
        placeId,
        fields: ["address_components"],
      },
      (placeDetails) => extractLocation(placeDetails)
    );

    setDropdownVisible(false);
  };

  useEffect(() => {
    setSearchValue(value || "");
    setSelectedLocation(value || "");
  }, [value]);

  // Debounced prediction fetch
  useEffect(() => {
    if (!searchValue.trim()) {
      setDropdownVisible(false);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (selectedLocation === searchValue) return;
      getPlacePredictions({
        input: searchValue,
        types: ["(cities)"],
      });
      setDropdownVisible(true);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setDropdownVisible(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    searchTermRef.current = value;
  }, [value]);

  useEffect(() => {
    return () => {
      if (searchTermRef.current || selectedLocation || searchValue.length > 0) clearOnUnmount?.();
    };
  }, []);

  const showDropdown =
    dropdownVisible &&
    (isPlacePredictionsLoading || placePredictions.length > 0);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Search city"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={() => searchValue && setDropdownVisible(true)}
        className="w-full rounded-lg px-4 py-3.5 bg-g-700 border border-g-500 outline-none text-g-300 placeholder-[#6A6B6C]"
      />

      {searchValue ? (
        <X
          className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
          onClick={() => {
            setSearchValue("");
            setSelectedLocation(null);
            onPlaceSelected?.({});
            setDropdownVisible(false);
            handleClear();
          }}
        />
      ) : (
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      )}

      {showDropdown && (
        <div className="absolute z-20 mt-1 w-full rounded-lg bg-g-700 shadow-lg">
          {isPlacePredictionsLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : (
            placePredictions.map((item) => (
              <div
                key={item.place_id}
                onClick={() => (
                  handleSelect(item.place_id), setDropdownVisible(false)
                )}
                className="cursor-pointer px-4 py-2 text-gray-300 hover:bg-zinc-700"
              >
                {item.description}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
