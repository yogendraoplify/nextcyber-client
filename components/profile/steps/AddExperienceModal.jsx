"use client";
import React, { useEffect, useState } from "react";
import SelectField from "@/components/SelectField";
import toast from "react-hot-toast";
import Modal from "@/components/modal/Modal";

export default function AddExperienceModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) {
  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else
      setForm({
        companyName: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        description: "",
      });
  }, [initialData]);

  const handleChange = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target?.value ?? e }));

  const handleSave = () => {
    if (!form.companyName || !form.jobTitle || !form.startDate) {
      toast.error("Please enter company , job title and Start Date");
      return;
    }
    onSave(form);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Work Experience" : "Add Work Experience"}
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label className="text-g-200 font-medium leading-6 block mb-1.5">
            Company Name
          </label>
          <SelectField
            label={null}
            name={null}
            options={["CyberCorp Inc", "Google", "Microsoft"]}
            placeholder="Enter company name"
            value={form.companyName}
            onChange={(v) => setForm((s) => ({ ...s, companyName: v }))}
          />
        </div>

        <div>
          <label className="text-g-200 font-medium leading-6 block mb-1.5">
            Job Title
          </label>
          <SelectField
            label={null}
            name={null}
            options={[
              "IT Security Intern",
              "Frontend Developer",
              "Backend Developer",
            ]}
            placeholder="Enter job title"
            value={form.jobTitle}
            onChange={(v) => setForm((s) => ({ ...s, jobTitle: v }))}
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

        <div className="col-span-2">
          <label className="text-g-200 font-medium leading-6 block mb-1.5">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            rows={6}
            className="w-full py-4 px-5 rounded-lg border text-g-100 outline-none bg-g-700 border-g-600 cursor-pointer"
            placeholder="Enter candidates profile info..."
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
