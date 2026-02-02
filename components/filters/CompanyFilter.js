import { useState, useEffect, useCallback } from "react";
import { X, RotateCcw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import SelectField from "../SelectField";
import { asyncGetDropdown } from "@/store/actions/dropdownAction";
import { asyncGetCompanies } from "@/store/actions/companiesAction";

export default function CompanyFilter({
  isOpen,
  onClose,
  filterData,
  setFilterData,
  setLoading,
  isFilterApplied,
}) {
  const [FormData, setFormData] = useState({
    location: filterData.location || "",
    sectors: filterData.sectors || [],
    companySize: filterData.companySize || null,
  });

  const [loadingLocal, setLoadingLocal] = useState({
    resetLoading: false,
    applyLoading: false,
  });
  const { sectorDropdown } = useSelector((state) => state.dropdown);

  const dispatch = useDispatch();

  // Sync with external filterData
  useEffect(() => {
    if (filterData) {
    }
  }, [filterData]);

  const fetchDropdowns = useCallback(() => {
    if (sectorDropdown?.length === 0)
      dispatch(asyncGetDropdown({ name: "industries" }));
  }, [dispatch]);

  const handleAddSector = () => {
    if (sectorInput.trim()) {
      const newSectors = [...(filterData.sectors || []), sectorInput.trim()];
      setFilterData({ ...filterData, sectors: newSectors });
      setSectorInput("");
    }
  };

  const handleRemoveSector = (sectorToRemove) => {
    const updatedSectors = (filterData.sectors || []).filter(
      (s) => s !== sectorToRemove
    );
    setFilterData({ ...filterData, sectors: updatedSectors });
  };

  const handleReset = () => {
    setLoadingLocal((prev) => ({ ...prev, resetLoading: true }));
    setLoading(true);
    setFilterData({
      sectors: [],
      companySize: null,
    });
    setTimeout(() => {
      setLoading(false);
      setLoadingLocal((prev) => ({ ...prev, resetLoading: false }));
    }, 300);
  };

  const handleApply = () => {
    setLoadingLocal((prev) => ({ ...prev, applyLoading: true }));
    setLoading(true);
    const params = {
      sectors: (FormData.sectors || []).join(","),
      companySize: FormData.companySize || "",
    };
    console.log("Applying filters with params:", params);
    dispatch(asyncGetCompanies(params)).then((data) => {
      setLoading(false);
      setLoadingLocal((prev) => ({ ...prev, applyLoading: false }));
    });
  };

  useEffect(() => {
    fetchDropdowns();
  }, [fetchDropdowns]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 z-50 w-full max-w-[360px] backdrop-blur-[40px] bg-g-900/40 text-g-100 h-screen p-6 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-g-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto pr-2 flex-1 pb-24">
        <div className=" mb-6">
          <SelectField
            label="Company Size"
            options={[
              { label: "1-10", value: "1-10" },
              { label: "11-50", value: "11-50" },
              { label: "51-200", value: "51-200" },
              { label: "201-500", value: "201-500" },
              { label: "501-1000", value: "501-1000" },
              { label: "1001+", value: "1001+" },
            ]}
            placeholder="Select company size"
            value={filterData.companySize}
            onChange={(value) => {
              setFilterData({ ...filterData, companySize: value });
              setFormData({ ...FormData, companySize: value });
            }}
          />
        </div>

        <div className="">
          <SelectField
            label="Industries"
            options={sectorDropdown}
            value={filterData.sectors || []}
            onChange={(value) => {
              setFilterData({ ...filterData, sectors: value });
              setFormData({ ...FormData, sectors: value });
            }}
            multiple
            onAdd={handleAddSector}
            placeholder="Type a sector and press Add"
            selectedOptions={filterData.sectors || []}
            onRemove={handleRemoveSector}
            isCreatable={true}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-g-900/80 backdrop-blur-md border-t border-neutral-800">
        <div className="max-w-[360px] mx-auto flex gap-3">
          <button
            disabled={loadingLocal.resetLoading || !isFilterApplied()}
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 bg-g-700 hover:bg-neutral-750 text-gray-300 py-3 rounded-lg transition-colors font-medium cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{loadingLocal.resetLoading ? "Resetting..." : "Reset"}</span>
          </button>
          <button
            disabled={loadingLocal.applyLoading || !isFilterApplied()}
            onClick={handleApply}
            className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-lg transition-colors font-medium cursor-pointer"
          >
            {loadingLocal.applyLoading ? "Applying..." : "Apply Filters"}
          </button>
        </div>
      </div>
    </div>
  );
}
