"use client";

import React from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  FileText,
  Paperclip,
  Upload,
  X,
} from "lucide-react";
import QuillEditor from "../QuillEditor";
import { Controller } from "react-hook-form";

export default function JobDescription({ form }) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      alert("File must be < 10MB");
      return;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <label className="block mb-4 text-sm leading-6 font-medium text-g-200">
          About Company
        </label>

        <Controller
          name="jobDescription"
          control={control}
          rules={{
            required: "Job description is required",
            validate: (value) =>
              value && value !== "<p><br></p>"
                ? true
                : "Job description is required",
          }}
          render={({ field }) => (
            <QuillEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Enter description.."
            />
          )}
        />

        {errors.jobDescription && (
          <p className="text-dark-red text-xs mt-1">
            {errors.jobDescription.message}
          </p>
        )}
      </div>
    </div>
  );
}
