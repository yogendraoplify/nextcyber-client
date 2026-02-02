"use client";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, SlidersHorizontal, Loader2 } from "lucide-react";
import LocationSearchInput from "@/components/helper/LocationSearchInput";
import StudentCard from "@/components/cards/StudentCard";
import {
  asyncAddCandidateToFavorite,
  asyncRemoveCandidateFromFavorite,
  asyncShortlistedCandidates,
} from "@/store/actions/candidateAction";
import { useDispatch, useSelector } from "react-redux";
import CandidateFilter from "@/components/filters/CandidateFilter";
import AdvancePagination from "@/components/ui/AdvancePagination";
import Search from "@/components/ui/Search";
import { removeShortlistedCandidates } from "@/store/slices/candidateSlice";
import useDidChange from "@/hooks/useDidChange";

export default function ShortlistingsPage() {
  const { user } = useSelector((state) => state.auth);
  const { shortlistedCandidates, totalPages, shortlistingCurrentPage } =
    useSelector((state) => state.candidate);
  const [page, setPage] = useState(shortlistingCurrentPage || 1);
  const [pageLimit, setPageLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const dispatch = useDispatch();
  const [showFilter, setShowFilter] = useState(false);
  const handleToggleFilter = () => setShowFilter(!showFilter);
  const [filterData, setFilterData] = useState({
    location: "",
    experience: "",
    skills: [],
    salaryRange: {
      min: 0,
      max: 0,
    },
    contractType: "",
    remotePolicy: "",
    experienceRange: { min: 0, max: 10 },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Build query params
  const buildParams = useCallback(() => {
    const params = {
      page,
      limit: pageLimit,
      location: locationSearch || "",
      ...Object.fromEntries(
        Object.entries({
          search: debounceSearchTerm, // Use debounced search term
        }).filter(([_, value]) => value !== ""),
      ),
    };
    return params;
  }, [page, debounceSearchTerm, locationSearch, pageLimit]);

  const handleFetchCandidates = useCallback(() => {
    setLoading(true);
    dispatch(asyncShortlistedCandidates(buildParams())).then(() =>
      setLoading(false),
    );
  }, [buildParams]);

  const handleFavoriteToggle = async (candidate) => {
    console.log("Toggling favorite for candidate:", candidate);
    candidate?.favoritedBy
      ?.map(({ company }) => company.id)
      .includes(user?.companyProfile.id)
      ? dispatch(
          asyncRemoveCandidateFromFavorite(
            candidate.id,
            user?.companyProfile.id,
          ),
        )
      : dispatch(
          asyncAddCandidateToFavorite(candidate.id, user?.companyProfile.id),
        );
  };

  const handleSearch = () => {
    const params = buildParams();
    setLoading(true);
    dispatch(asyncShortlistedCandidates(params)).then(() => setLoading(false));
  };

  useEffect(() => {
    if (shortlistedCandidates?.length === 0) handleFetchCandidates();
  }, []);

  useDidChange(page, () => {
    handleFetchCandidates();
  }, [page, pageLimit]);

  const clearOnUnmount = () => {
    dispatch(removeShortlistedCandidates());
  };

  const handleClearSearch = () => {
    setLoading(true);
    setSearchTerm("");
    dispatch(asyncShortlistedCandidates()).then(() => setLoading(false));
  };

  const isFilterApplied = () => {
    return (
      filterData.contractType ||
      filterData.remotePolicy ||
      (filterData.skills && filterData.skills.length > 0) ||
      (filterData.salaryRange &&
        (filterData.salaryRange.min > 0 || filterData.salaryRange.max > 0)) ||
      (filterData.experienceRange &&
        (filterData.experienceRange.min > 0 ||
          filterData.experienceRange.max < 10))
    );
  };

  const filterDataRef = useRef(filterData);

  useEffect(() => {
    filterDataRef.current = filterData;
  }, [filterData]);

  useEffect(() => {
    return () => {
      const filters = filterDataRef.current;
      if (
        filters.contractType ||
        filters.remotePolicy ||
        (filters.skills && filters.skills.length > 0) ||
        (filters.salaryRange &&
          (filters.salaryRange.min > 0 || filters.salaryRange.max > 0)) ||
        (filters.experienceRange &&
          (filters.experienceRange.min > 0 || filters.experienceRange.max < 10))
      ) {
        clearOnUnmount();
      }
    };
  }, []);

  return (
    <>
      <div className="h-[calc(100vh-100.6px)] grid grid-rows-[auto_1fr_auto] relative overflow-y-hidden!">
        {/* 🔹 Header / Filters (Fixed) */}
        <div className="sticky top-0 z-10 flex flex-col items-center md:flex-row gap-4">
          <div className="relative w-full md:w-2/5">
            <Search
              value={searchTerm}
              setValue={setSearchTerm}
              placeholder="Search candidates..."
              className="w-full!"
              handleClear={handleClearSearch}
              clearOnUnmount={clearOnUnmount}
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
                className="bg-primary/90 rounded-lg px-4 py-3.5 text-gray-300 cursor-pointer flex items-center gap-2 truncate"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {loading ? (
              <div className="flex justify-center items-center col-span-full py-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : shortlistedCandidates?.length > 0 ? (
              shortlistedCandidates.map((candidate, index) => (
                <StudentCard
                  key={candidate.id}
                  candidate={candidate}
                  index={index}
                  handleFavoriteToggle={() => handleFavoriteToggle(candidate)}
                  isFavorite={candidate?.favoritedBy
                    ?.map(({ company }) => company.id)
                    .includes(user?.companyProfile.id)}
                  style={{
                    background:
                      "radial-gradient(150.01% 100% at 50% 0%, rgba(2, 91, 207, 0.22) 0%, #1B1C1E 42%)",
                  }}
                  className="hover:border-[#025BCF]!"
                />
              ))
            ) : (
              <div className="flex justify-center items-center col-span-full py-10 text-gray-400">
                No candidates found.
              </div>
            )}
          </div>
        </div>

        {shortlistedCandidates?.length > 0 && !loading && (
          <div className="sticky bottom-0 flex justify-center mt-5">
            <AdvancePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        )}
      </div>
      {showFilter && (
        <CandidateFilter
          filterData={filterData}
          isOpen={showFilter}
          onClose={handleToggleFilter}
          setFilterData={setFilterData}
          setLoading={setLoading}
          handleApplyFilters={(params) =>
            dispatch(asyncShortlistedCandidates(params))
          }
          handleResetFilters={() => dispatch(asyncShortlistedCandidates())}
          isFilterApplied={isFilterApplied}
        />
      )}
    </>
  );
}
