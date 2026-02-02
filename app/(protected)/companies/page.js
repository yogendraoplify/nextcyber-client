"use client";
import { asyncGetCompanies } from "@/store/actions/companiesAction";
import { Loader2, SlidersHorizontal } from "lucide-react";
import CompanyCard from "@/components/cards/CompanyCard";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LocationSearchInput from "@/components/helper/LocationSearchInput";
import AdvancePagination from "@/components/ui/AdvancePagination";
import CompanyFilter from "@/components/filters/CompanyFilter";
import Search from "@/components/ui/Search";
import { removeCompanies } from "@/store/slices/companySlice";
import useDidChange from "@/hooks/useDidChange";

function CompaniesPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { companies } = useSelector((state) => state.companies);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [locationSearch, setLocationSearch] = useState("");
  const [filterData, setFilterData] = useState({
    location: "",
    industry: "",
    companySize: "",
    sectors: [],
  });
  const [showFilter, setShowFilter] = useState(false);
  const handleToggleFilter = () => setShowFilter(!showFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const buildParams = useCallback(() => {
    const params = {
      page,
      ...Object.fromEntries(
        Object.entries({
          location: locationSearch || "",
          industry: debouncedSearchTerm,
          companySize: filterData.companySize,
        }).filter(([_, value]) => value !== ""),
      ),
    };
    return params;
  }, [page, debouncedSearchTerm, locationSearch]);

  const fetchCompanies = useCallback(() => {
    setLoading(true);
    const params = buildParams();
    dispatch(asyncGetCompanies(params, setLoading)).then((data) => {
      setTotalPages(data?.totalPages || 1);
      setLoading(false);
    });
  }, [dispatch, buildParams]);

  const handleSearch = () => {
    setLoading(true);
    const params = buildParams();
    console.log("Searching with params:", params);
    dispatch(asyncGetCompanies(params, setLoading)).then((data) => {
      setTotalPages(data?.totalPages || 1);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (companies?.length === 0) fetchCompanies();
  }, []);

  const clearOnUnmount = () => {
    dispatch(removeCompanies());
    setSearchTerm("");
    return true;
  };

  const handleClearSearch = () => {
    setLoading(true);
    setSearchTerm("");
    dispatch(asyncGetCompanies()).then(() => setLoading(false));
  };

  useDidChange(page, () => {
    fetchCompanies();
  });

  const isFilterApplied = () => {
    return filterData.industry || filterData.companySize || filterData.location;
  };

  const filterDataRef = React.useRef(filterData);

  useEffect(() => {
    filterDataRef.current = filterData;
  }, [filterData]);

  useEffect(() => {
    return () => {
      const currentFilter = filterDataRef.current;
      if (
        currentFilter.industry ||
        currentFilter.companySize ||
        currentFilter.location
      ) {
        clearOnUnmount();
      }
    };
  }, []);

  return (
    <>
      <div className="h-[calc(100vh-100.6px)] grid grid-rows-[auto_1fr_auto] relative overflow-y-hidden!">
        <div className="sticky top-0 z-10 flex flex-col items-center md:flex-row gap-4">
          <div className="relative w-full md:w-2/5">
            <Search
              value={searchTerm}
              setValue={setSearchTerm}
              placeholder="Search companies..."
              className="w-full!"
              clearOnUnmount={clearOnUnmount}
              handleClear={handleClearSearch}
            />
          </div>

          <div className="relative w-full md:w-2/5">
            <LocationSearchInput
              selectedPlace={locationSearch}
              onPlaceSelected={(locationData) =>
                setLocationSearch(
                  locationData.city && locationData.state
                    ? `${locationData?.city}, ${locationData?.state}, ${locationData?.country}`
                    : "",
                )
              }
              clearOnUnmount={clearOnUnmount}
              handleClear={handleClearSearch}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={
                loading ||
                (searchTerm.trim() === "" && locationSearch.trim() === "")
              }
              onClick={handleSearch}
              className="bg-primary rounded-lg px-8 py-3.5 text-gray-300 cursor-pointer"
            >
              Search
            </button>

            {isFilterApplied() ? (
              <button
                onClick={handleToggleFilter}
                className="bg-primary/90 rounded-lg px-4 py-3.5 text-gray-300 cursor-pointer flex items-center gap-2"
              >
                <span className="truncate">Filters Applied</span>
              </button>
            ) : (
              <button
                onClick={handleToggleFilter}
                className="flex items-center gap-2 bg-g-600 rounded-lg px-12 py-3.5 text-gray-300 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filter
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto max-h-full mt-5">
          <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center">
            {loading ? (
              <div className="flex justify-center items-center col-span-full py-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : companies.length > 0 ? (
              companies.map((company, i) => (
                <CompanyCard company={company} key={i} />
              ))
            ) : (
              <div className="flex justify-center items-center col-span-full py-10 text-gray-400">
                No companies found.
              </div>
            )}
          </div>
          {companies?.length > 0 && !loading && (
            <div className="sticky bottom-0 flex justify-center mt-5">
              <AdvancePagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(page) => setPage(page)}
              />
            </div>
          )}
        </div>
      </div>

      {showFilter && (
        <CompanyFilter
          isOpen={showFilter}
          onClose={handleToggleFilter}
          filterData={filterData}
          setFilterData={setFilterData}
          setLoading={setLoading}
          isFilterApplied={isFilterApplied}
        />
      )}
    </>
  );
}

export default CompaniesPage;
