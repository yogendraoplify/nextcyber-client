import { useState, useEffect, useCallback } from "react";
import { X, RotateCcw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetCandidates } from "@/store/actions/candidateAction";
import RangeFilter from "../ui/RangeFilter";
import { asyncGetJobs } from "@/store/actions/jobActions";
import SelectField from "../SelectField";
import { asyncGetDropdown } from "@/store/actions/dropdownAction";

export default function JobFilter({
  isOpen,
  onClose,
  filterData,
  setFilterData,
  setLoading,
  isFilterApplied,
}) {
  if (!isOpen) return null;
  // Local state
  const [FormData, setFormData] = useState({
    contractType: filterData.contractType || "",
    remotePolicy: filterData.remotePolicy || "",
    minSalary: "",
    maxSalary: "",
    experienceRange: filterData.experienceRange || { min: 0, max: 10 },
    skills: filterData.skills || [],
  });
  const dispatch = useDispatch();
  const [loadingLocal, setLoadingLocal] = useState({
    resetLoading: false,
    applyLoading: false,
  });
  const { skillsDropdown } = useSelector((state) => state.dropdown);
  // Sync with external filterData
  useEffect(() => {
    if (filterData) {
      setFormData({
        contractType: filterData.contractType || "",
        remotePolicy: filterData.remotePolicy || "",
        experienceRange: filterData.experienceRange,
        skills: filterData.skills,
      });
    }
  }, [filterData]);

  const fetchDropdowns = useCallback(() => {
    if (skillsDropdown?.length === 0)
      dispatch(asyncGetDropdown({ name: "skills" }));
  }, [skillsDropdown, dispatch]);

  const handleContractTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, contractType: type }));
    setFilterData((prev) => ({ ...prev, contractType: type }));
  };

  const handleRemotePolicyChange = (policy) => {
    setFormData((prev) => ({ ...prev, remotePolicy: policy }));
    setFilterData((prev) => ({ ...prev, remotePolicy: policy }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const newSkills = [...(filterData.skills || []), skillInput.trim()];
      setFilterData({ ...filterData, skills: newSkills });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = (filterData.skills || []).filter(
      (s) => s !== skillToRemove,
    );
    setFilterData({ ...filterData, skills: updatedSkills });
  };

  const handleReset = () => {
    setLoadingLocal((prev) => ({ ...prev, resetLoading: true }));
    setLoading(true);
    setFormData({
      contractType: "TEMPORARY",
      remotePolicy: "onsite",
      minSalary: "",
      maxSalary: "",
      experienceRange: { min: 0, max: 10 },
      skills: [],
    });

    setFilterData({
      contractType: "",
      remotePolicy: "",
      skills: [],
      salaryRange: [],
      experienceRange: { min: 0, max: 10 },
    });
    dispatch(asyncGetJobs())
      .then(() => {
        setLoading(false);
        setLoadingLocal((prev) => ({ ...prev, resetLoading: false }));
      })
      .catch(() => {
        setLoading(false);
        setLoadingLocal((prev) => ({ ...prev, resetLoading: false }));
      });
  };

  const handleApply = () => {
    setLoadingLocal((prev) => ({ ...prev, applyLoading: true }));
    setLoading(true);
    setFilterData({
      ...filterData,
      contractType: FormData.contractType,
      remotePolicy: FormData.remotePolicy,
      salaryRange: [FormData.minSalary, FormData.maxSalary],
      experienceRange: FormData.experienceRange,
      skills: FormData.skills,
    });
    const params = {
      contractType: FormData.contractType?.toUpperCase(),
      remotePolicy: FormData.remotePolicy?.toUpperCase(),
      salary:
        FormData.minSalary && FormData.maxSalary
          ? `${FormData.minSalary}-${FormData.maxSalary}`
          : null,
      experience: `${FormData.experienceRange.min}-${FormData.experienceRange.max}`,
      skills: filterData.skills.join(",") || [],
    };
    dispatch(asyncGetJobs(params))
      .then(() => setLoading(false))
      .finally(() => {
        setLoadingLocal((prev) => ({ ...prev, applyLoading: false }));
        onClose();
      });
  };

  useEffect(() => {
    fetchDropdowns();
  }, [fetchDropdowns]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 z-90 w-full max-w-[360px] backdrop-blur-[40px] bg-g-900/40 text-g-100 h-screen p-6 flex flex-col">
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
        {/* Contract Type */}
        <div className="mb-8">
          <h3 className="text-sm font-medium mb-4">Contract Type</h3>
          <div className="space-y-3">
            {[
              { value: "TEMPORARY", label: "Temporary employment" },
              { value: "PERMANENT", label: "Fixed term" },
              { value: "FREELANCE", label: "Freelance" },
              { value: "INTERNSHIP", label: "Internship" },
            ].map(({ value, label }) => (
              <label
                key={value}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={FormData.contractType === value}
                  onChange={() => handleContractTypeChange(value)}
                  className="w-4 h-4 rounded border-2 border-gray-600 checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors uppercase">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Remote Policy */}
        <div className="mb-8">
          <h3 className="text-sm font-medium mb-4">Remote Policy</h3>
          <div className="space-y-3">
            {[
              { value: "onsite", label: "On-site" },
              { value: "hybrid", label: "Hybrid" },
              { value: "remote", label: "Remote" },
            ].map(({ value, label }) => (
              <label
                key={value}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={FormData.remotePolicy === value}
                  onChange={() => handleRemotePolicyChange(value)}
                  className="w-4 h-4 rounded border-2 border-gray-600 checked:bg-primary checked:border-blue-600 focus:ring-2 focus:ring-primaborder-primary cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary */}
        <div className="mb-8">
          <h3 className="text-sm font-medium mb-4">Salary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Min.</label>
              <input
                type="text"
                value={FormData.minSalary}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minSalary: e.target.value,
                  }))
                }
                placeholder="e.g. 50,000"
                className="w-full rounded-lg px-3 py-3 text-sm bg-g-700 border border-g-500 outline-none text-g-300 placeholder-[#6A6B6C] focus:outline-none mb-3"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">Max.</label>
              <input
                type="text"
                value={FormData.maxSalary}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxSalary: e.target.value,
                  }))
                }
                placeholder="e.g. 150,000"
                className="w-full rounded-lg px-3 py-3 text-sm bg-g-700 border border-g-500 outline-none text-g-300 placeholder-[#6A6B6C] focus:outline-none mb-3"
              />
            </div>
          </div>
        </div>

        {/* Experience Range - Fixed & Improved */}
        <div className="mb-8">
          <h3 className="text-sm font-medium mb-4">Experience</h3>
          <RangeFilter
            min={0}
            max={10}
            step={1}
            value={FormData.experienceRange}
            onChange={(newRange) => {
              setFormData((prev) => ({ ...prev, experienceRange: newRange }));
            }}
          />
        </div>

        {/* Skills */}
        <div className="mb-8">
          <SelectField
            label="Skills"
            options={skillsDropdown}
            value={FormData?.skills}
            onChange={(value) =>
              console.log(value) ||
              setFormData((prev) => ({ ...prev, skills: value }))
            }
            multiple
            onAdd={handleAddSkill}
            placeholder="Type a skill and press Add"
            selectedOptions={FormData?.skills || []}
            onRemove={handleRemoveSkill}
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
