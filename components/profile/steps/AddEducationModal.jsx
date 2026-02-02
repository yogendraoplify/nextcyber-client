"use client";
import React, { useEffect, useState } from "react";
import SelectField from "@/components/SelectField";
import toast from "react-hot-toast";
import Modal from "@/components/modal/Modal";

export default function AddEducationModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) {
  const [form, setForm] = useState({
    institute: "",
    level: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ institute: "", level: "", startDate: "", endDate: "" });
  }, [initialData]);

  const handleChange = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target?.value ?? e }));

  const handleSave = () => {
    if (!form.institute || !form.level || !form.startDate) {
      toast.error("Please enter institute, level and Start Date");
      return;
    }
    onSave(form);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Education" : "Add Education"}
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label className="text-g-200 font-medium leading-6 block mb-1.5">
            Institute
          </label>
          <input
            placeholder="Enter institute name"
            value={form.institute}
            onChange={(e) =>
              setForm((s) => ({ ...s, institute: e.target.value }))
            }
            className="w-full py-4 px-5 rounded-lg border text-g-300 outline-none bg-g-700 border-g-600"
          />
        </div>

        <div>
          <label className="text-g-200 font-medium leading-6 block mb-1.5">
            Level
          </label>
          <SelectField
            label={null}
            name={null}
            options={["HIGH_SCHOOL", "ASSOCIATE", "BACHELORS", "MASTERS"]}
            placeholder="Select level"
            value={form.level}
            onChange={(v) => setForm((s) => ({ ...s, level: v }))}
          />
        </div>

        <div>
          <label className="text-g-200 font-medium leading-6 block mb-1.5">
            Start Date
          </label>
          <input
            type="date"
            value={form.startDate}
            onChange={handleChange("startDate")}
            className="w-full py-4 px-5 rounded-lg border text-g-100 outline-none bg-g-700 border-g-600 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-g-200 font-medium leading-6 block mb-1.5">
            End Date
          </label>
          <input
            type="date"
            value={form.endDate}
            onChange={handleChange("endDate")}
            className="w-full py-4 px-5 rounded-lg border text-g-100 outline-none bg-g-700 border-g-600 cursor-pointer"
          />
        </div>

        <div className="col-span-2 flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="px-4 py-3 bg-primary text-white rounded text-sm leading-5 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
