"use client";
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, SlidersHorizontal, Loader2 } from "lucide-react";
import LocationSearchInput from "@/components/helper/LocationSearchInput";
import StudentCard from "@/components/cards/StudentCard";
import {
  asyncAddCandidateToFavorite,
  asyncGetCandidates,
  asyncRemoveCandidateFromFavorite,
} from "@/store/actions/candidateAction";
import { useDispatch, useSelector } from "react-redux";
import CandidateFilter from "@/components/filters/CandidateFilter";
import toast from "react-hot-toast";
import AdvancePagination from "@/components/ui/AdvancePagination";
import Search from "@/components/ui/Search";
import { removeCandidates } from "@/store/slices/candidateSlice";
import useDidChange from "@/hooks/useDidChange";

export default function CandidatesPage() {
  const { user } = useSelector((state) => state.auth);
  const { candidates, totalPages, candidateCurrentPage } = useSelector(
    (state) => state.candidate,
  );
  const [page, setPage] = useState(candidateCurrentPage || 1);
  const pageRef = useRef(page);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const dispatch = useDispatch();
  const [showFilter, setShowFilter] = useState(false);
  const handleToggleFilter = () => setShowFilter(!showFilter);
  const [filterData, setFilterData] = useState({
    experience: "",
    skills: [],
    salaryRange: { min: 0, max: 0 },
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
      ...Object.fromEntries(
        Object.entries({
          search: debounceSearchTerm, // Use debounced search term
          location: locationSearch,
        }).filter(([_, value]) => value !== ""),
      ),
    };
    return params;
  }, [page, debounceSearchTerm, locationSearch]);

  const handleSearchCandidates = (params) => {
    setLoading(true);
    dispatch(asyncGetCandidates(params)).then(() => {
      setLoading(false);
    });
  };

  const handleFetchCandidates = () => {
    const params = buildParams();
    setLoading(true);
    dispatch(asyncGetCandidates(params)).then(() => setLoading(false));
  };

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

  useEffect(() => {
    if (candidates?.length === 0) handleFetchCandidates();
  }, []);

  const clearOnUnmount = () => {
    console.log("Clearing candidates on unmount");
    setSearchTerm("");
    dispatch(removeCandidates());
  };

  const handleClearSearch = () => {
    setLoading(true);
    setSearchTerm("");
    dispatch(asyncGetCandidates()).then(() => setLoading(false));
  };

  const isFilterApplied = () => {
    console.log("Checking if filters are applied:", filterData);
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

  useDidChange(page, () => {
    handleFetchCandidates();
  }, [page, totalPages]);

  return (
    <>
      <div className="h-[calc(100vh-100.6px)] grid grid-rows-[auto_1fr_auto] relative overflow-y-hidden!">
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
              handleClear={handleClearSearch}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={
                loading ||
                (searchTerm.trim() === "" && locationSearch.trim() === "")
              }
              onClick={() => handleSearchCandidates(buildParams())}
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
            ) : candidates?.length > 0 ? (
              candidates.map((candidate, index) => (
                <StudentCard
                  key={candidate.id}
                  candidate={candidate}
                  PaginationProps
                  index={index}
                  handleFavoriteToggle={() => handleFavoriteToggle(candidate)}
                  isFavorite={candidate?.favoritedBy
                    ?.map(({ company }) => company.id)
                    .includes(user?.companyProfile.id)}
                />
              ))
            ) : (
              <div className="flex justify-center items-center col-span-full py-10 text-gray-400">
                No candidates found.
              </div>
            )}
          </div>
        </div>

        {candidates?.length > 0 && !loading && (
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
          handleApplyFilters={(params) => dispatch(asyncGetCandidates(params))}
          handleResetFilters={() => dispatch(asyncGetCandidates())}
          isFilterApplied={isFilterApplied}
        />
      )}
    </>
  );
}
