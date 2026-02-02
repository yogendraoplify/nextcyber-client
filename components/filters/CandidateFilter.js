"use client";

import { useState, useEffect, useCallback } from "react";
import { X, RotateCcw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import RangeFilter from "../ui/RangeFilter";
import SelectField from "../SelectField";
import { asyncGetDropdown } from "@/store/actions/dropdownAction";

const DEFAULT_FILTERS = {
  experience: "",
  skills: [],
  salaryRange: { min: 0, max: 0 },
  contractType: "",
  remotePolicy: "",
  experienceRange: { min: 0, max: 10 },
};

export default function CandidateFilter({
  isOpen,
  onClose,
  filterData = DEFAULT_FILTERS,
  setFilterData,
  setLoading,
  handleApplyFilters,
  handleResetFilters,
  isFilterApplied,
}) {
  const dispatch = useDispatch();
  const { skillsDropdown = [] } = useSelector((state) => state.dropdown);

  const [formState, setFormState] = useState(DEFAULT_FILTERS);
  const [loading, setLocalLoading] = useState({
    apply: false,
    reset: false,
  });

  useEffect(() => {
    setFormState({ ...DEFAULT_FILTERS, ...filterData });
  }, [filterData]);

  useEffect(() => {
    if (!skillsDropdown.length) {
      dispatch(asyncGetDropdown({ name: "skills" }));
    }
  }, [dispatch, skillsDropdown.length]);

  const updateField = useCallback((key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
    setFilterData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = async () => {
    setLocalLoading({ reset: true, apply: false });
    setLoading(true);

    setFormState(DEFAULT_FILTERS);
    setFilterData(DEFAULT_FILTERS);

    try {
      await handleResetFilters();
    } finally {
      setLocalLoading({ reset: false, apply: false });
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setLocalLoading({ apply: true, reset: false });
    setLoading(true);

    setFilterData(formState);

    const params = {
      contractType: formState.contractType,
      remotePolicy: formState.remotePolicy,
      salary:
        formState.salaryRange.min && formState.salaryRange.max
          ? `${formState.salaryRange.min}-${formState.salaryRange.max}`
          : null,
      experience: `${formState.experienceRange.min}-${formState.experienceRange.max}`,
      skills: formState.skills.join(","),
    };

    try {
      await handleApplyFilters(params);
      onClose();
    } finally {
      setLocalLoading({ apply: false, reset: false });
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 z-50 w-full max-w-[360px] bg-g-900/40 backdrop-blur-[40px] text-g-100 h-screen p-6 flex flex-col">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button onClick={onClose} className="cursor-pointer">
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-28">
        <FilterGroup title="Contract Type">
          {["TEMPORARY", "PERMANENT", "FREELANCE", "INTERNSHIP"].map((type) => (
            <RadioItem
              key={type}
              checked={formState.contractType === type}
              label={type}
              onChange={() => updateField("contractType", type)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Remote Policy">
          {["onsite", "hybrid", "remote"].map((policy) => (
            <RadioItem
              key={policy}
              checked={formState.remotePolicy === policy}
              label={policy}
              onChange={() => updateField("remotePolicy", policy)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Salary">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Min",
                placeholder: "e.g. 30000",
              },
              { label: "Max", placeholder: "e.g. 150000" },
            ].map((label, i) => (
              <div key={i}>
                <label className="text-sm text-gray-300 mb-2 block">
                  {label.label}
                </label>
                <input
                  key={label.label}
                  value={i === 0 ? formState.salaryRange.min : formState.salaryRange.max || ""}
                  placeholder={label.placeholder}
                  onChange={(e) =>
                    updateField("salaryRange", {
                      ...formState.salaryRange,
                      [i === 0 ? "min" : "max"]: +e.target.value,
                    })
                  }
                  className="bg-g-700 border border-g-500 rounded-lg px-3 py-3 text-sm outline-none w-full text-g-300"
                />
              </div>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Experience">
          <RangeFilter
            min={0}
            max={10}
            step={1}
            value={formState.experienceRange}
            onChange={(value) => updateField("experienceRange", value)}
          />
        </FilterGroup>

        <SelectField
          label="Skills"
          options={skillsDropdown}
          value={formState.skills}
          onChange={(value) => updateField("skills", value)}
          multiple
          isCreatable
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-g-900/80 border-t border-neutral-800 p-6">
        <div className="max-w-[360px] mx-auto flex gap-3">
          <ActionButton
            loading={loading.reset}
            icon={<RotateCcw className="w-4 h-4" />}
            text="Reset"
            onClick={handleReset}
            variant="secondary"
            isFilterApplied={isFilterApplied}
          />
          <ActionButton
            loading={loading.apply}
            text="Apply Filters"
            onClick={handleApply}
            variant="primary"
            isFilterApplied={isFilterApplied}
          />
        </div>
      </div>
    </div>
  );
}

const FilterGroup = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-sm font-medium mb-4">{title}</h3>
    {children}
  </div>
);

const RadioItem = ({ checked, label, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer mb-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded border-gray-600 checked:bg-primary"
    />
    <span className="text-sm text-gray-300 capitalize">{label}</span>
  </label>
);

const ActionButton = ({ loading, text, onClick, icon, variant, isFilterApplied }) => (
  <button
    disabled={loading || !isFilterApplied()}
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium cursor-pointer
      ${
        variant === "primary"
          ? "bg-primary text-white"
          : "bg-g-700 text-gray-300"
      }`}
  >
    {icon}
    {loading ? `${text}...` : text}
  </button>
);
