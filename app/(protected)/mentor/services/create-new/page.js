"use client";
import { useState, useRef, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import QuillEditor from "@/components/QuillEditor"; // ✅ your existing wizzybag
import { createOneToOneService } from "@/services/mentorApi";

// ─── Constants ───────────────────────────────────────────
const DURATIONS = [
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "60 minutes", value: 60 },
  { label: "Custom", value: "custom" },
];

const BUFFER_OPTIONS = [
  { label: "None", value: 0 },
  { label: "5 min", value: 5 },
  { label: "10 min", value: 10 },
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
];

const SKILLS_LIST = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "System Design",
  "DSA",
  "AWS",
  "DevOps",
  "Machine Learning",
  "UI/UX Design",
  "Product Management",
  "Data Science",
  "Go",
  "Rust",
];

const FIELD_TYPES = [
  { label: "Paragraph (Text Area)", value: "textarea" },
  { label: "Short Answer", value: "text" },
  { label: "Multiple Choice", value: "radio" },
];

// ─── Sub-components ──────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const ErrorMsg = ({ msg }) =>
  msg ? <p className="text-red-500 text-xs mt-1.5 font-medium">{msg}</p> : null;

const FieldRow = ({ index, control, errors, remove, duplicate }) => (
  <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50 space-y-3">
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <Controller
        name={`questions.${index}.type`}
        control={control}
        render={({ field: f }) => (
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white min-w-[200px]">
            <span className="text-gray-400 text-sm">☰</span>
            <select
              {...f}
              className="text-sm text-gray-700 bg-transparent outline-none flex-1 cursor-pointer"
            >
              {FIELD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        )}
      />
      <div className="flex items-center gap-3 ml-auto">
        <span className="text-sm text-gray-500 font-medium">Required</span>
        <Controller
          name={`questions.${index}.required`}
          control={control}
          render={({ field: f }) => (
            <button
              type="button"
              onClick={() => f.onChange(!f.value)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${f.value ? "bg-blue-600" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${f.value ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          )}
        />
        <button
          type="button"
          onClick={() => duplicate(index)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 transition-colors text-sm"
        >
          ⧉
        </button>
        <button
          type="button"
          onClick={() => remove(index)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors font-bold text-base"
        >
          ✕
        </button>
      </div>
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
        Field name
      </p>
      <Controller
        name={`questions.${index}.label`}
        control={control}
        rules={{ required: "Field name is required." }}
        render={({ field: f }) => (
          <input
            {...f}
            placeholder="e.g. What do you expect from this session?"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300"
          />
        )}
      />
      <ErrorMsg msg={errors?.questions?.[index]?.label?.message} />
    </div>
  </div>
);

// ─── Cover Image Upload (shared) ─────────────────────────
const CoverUpload = ({ coverPreview, onFileChange, onDrop }) => {
  const ref = useRef(null);
  return (
    <div>
      <Label>Add Cover Image</Label>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => ref.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
      >
        {coverPreview ? (
          <img
            src={coverPreview}
            className="h-20 rounded-xl object-cover w-full max-w-xs"
            alt="cover"
          />
        ) : (
          <>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-xl flex-shrink-0">
              ☁
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                <span className="text-blue-600">Upload</span> or drop
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Required dimensions 826×360
              </p>
            </div>
          </>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFileChange(e.target.files[0])}
        />
      </div>
    </div>
  );
};

// ─── AI Generate Button (shared) ─────────────────────────
const GenerateAIBtn = ({ onClick, loading, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading || disabled}
    className="mt-2 flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white disabled:opacity-50 transition-all"
    style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" }}
  >
    <span className={`text-base ${loading ? "animate-spin" : ""}`}>✦</span>
    {loading ? "Generating..." : "Generate with AI"}
  </button>
);

// ─── Main Component ──────────────────────────────────────
export default function CreateServiceModal({
  onClose,
  onSubmit: onSubmitProp,
}) {
  const coverInputRef = useRef(null); // ✅ already have this
  const coverFileRef = useRef(null); // ✅ add this to store the actual File object
  const [serviceType, setServiceType] = useState("ONE_TO_ONE");
  const [coverPreview, setCoverPreview] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillDrop, setShowSkillDrop] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);

  const isWebinar = serviceType === "WEBINAR";

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      // shared
      title: "",
      description: "",
      price: "",
      discountedPrice: "",
      // one-to-one
      callDuration: 30,
      customDuration: "",
      bufferTime: 0,
      skills: [],
      questions: [
        {
          type: "textarea",
          label: "What do you expect from this session?",
          required: true,
        },
      ],
      // webinar
      instructions: "",
      webinarDate: "",
      webinarDuration: 30,
      webinarURL: "",
      bookingNotifications: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const watchDuration = watch("callDuration");
  const watchSkills = watch("skills");
  const watchTitle = watch("title");

  // ── Cover image ──────────────────────────────────────
  const handleCoverChange = (file) => {
    if (!file) return;
    coverFileRef.current = file; // ✅ store actual File for FormData
    const reader = new FileReader();
    reader.onload = (e) => setCoverPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    handleCoverChange(e.dataTransfer.files[0]);
  }, []);

  // ── Skills ───────────────────────────────────────────
  const addSkill = (skill) => {
    const current = getValues("skills");
    if (current.length >= 10 || current.includes(skill)) return;
    setValue("skills", [...current, skill]);
    setSkillInput("");
    setShowSkillDrop(false);
  };

  const removeSkill = (skill) =>
    setValue(
      "skills",
      getValues("skills").filter((s) => s !== skill),
    );

  const filteredSkills = SKILLS_LIST.filter(
    (s) =>
      s.toLowerCase().includes(skillInput.toLowerCase()) &&
      !watchSkills.includes(s),
  );

  // ── AI Description ───────────────────────────────────
  const handleGenerateDesc = async () => {
    if (!watchTitle) return;
    setGeneratingDesc(true);
    await new Promise((r) => setTimeout(r, 1500)); // replace with your API call
    setValue(
      "description",
      `A comprehensive ${watchTitle} session where you'll get personalized guidance, actionable feedback, and expert insights tailored to your specific needs and goals.`,
    );
    setGeneratingDesc(false);
  };

  // ── Duplicate question ───────────────────────────────
  const duplicateQuestion = (index) =>
    append({ ...getValues(`questions.${index}`) });

  // ── Submit ───────────────────────────────────────────
  // const onSubmit = async (data) => {
  //   const base = {
  //     type: serviceType,
  //     title: data.title,
  //     description: data.description,
  //     price: parseFloat(data.price),
  //     discountedPrice: data.discountedPrice
  //       ? parseFloat(data.discountedPrice)
  //       : null,
  //   };

  //   const payload = isWebinar
  //     ? {
  //         ...base,
  //         webinarDuration: parseInt(data.webinarDuration),
  //         webinarDate: data.webinarDate,
  //         instructions: data.instructions,
  //         webinarURL: data.webinarURL,
  //       }
  //     : {
  //         ...base,
  //         callDuration:
  //           data.callDuration === "custom"
  //             ? parseInt(data.customDuration)
  //             : data.callDuration,
  //         bufferTime: data.bufferTime,
  //         skills: data.skills,
  //         questions: data.questions.map((q) => q.label),
  //       };

  //   await onSubmitProp?.(payload);
  // };
  const onSubmit = async (data) => {
    const base = {
      type: serviceType,
      title: data.title,
      description: data.description,
      price: parseFloat(data.price),
      discountedPrice: data.discountedPrice
        ? parseFloat(data.discountedPrice)
        : null,
    };

    const payload = isWebinar
      ? {
          ...base,
          webinarDuration: parseInt(data.webinarDuration),
          webinarDate: data.webinarDate,
          instructions: data.instructions,
          webinarURL: data.webinarURL,
        }
      : {
          ...base,
          callDuration:
            data.callDuration === "custom"
              ? parseInt(data.customDuration)
              : data.callDuration,
          bufferTime: data.bufferTime,
          skills: data.skills,
          questions: data.questions.map((q) => q.label),
        };

    // ── Build FormData ───────────────────────────────────
    const formData = new FormData();

    // Append all text fields as JSON string
    // (your backend parses req.body fields individually)
    Object.entries(payload).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      // Arrays & objects must be stringified
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    // ── Append cover image if selected ──────────────────
    const coverFile = coverInputRef.current?.files?.[0];
    if (coverFile) {
      formData.append("coverImage", coverFile);
    }

    // ── API call ─────────────────────────────────────────
    try {
      // await onSubmitProp?.(formData); // pass formData up to parent
      // OR call directly here:
      const res = await createOneToOneService(formData);

      if (res.data.success)
        // NOTE: do NOT set Content-Type header — axios sets it
        //       automatically with the correct boundary for FormData
        onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Add your Service</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto flex-1 px-7 py-6 space-y-6"
        >
          {/* Service Type toggle */}
          <div>
            <Label required>Service Type</Label>
            <div className="flex gap-3 flex-wrap">
              {[
                { label: "Video Based", value: "ONE_TO_ONE" },
                { label: "Webinar", value: "WEBINAR" },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setServiceType(t.value)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-150 ${
                    serviceType === t.value
                      ? "border-blue-600 text-blue-600 bg-blue-50"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service Title (shared) */}
          <div>
            <Label required>Service Title</Label>
            <input
              {...register("title", { required: "Service title is required." })}
              placeholder="Service Name"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300"
            />
            <ErrorMsg msg={errors.title?.message} />
          </div>

          {/* Description (shared) */}
          <div>
            <Label required>Description</Label>
            <textarea
              {...register("description", {
                required: "Description is required.",
              })}
              rows={5}
              placeholder="Please fill the above required fields to generate description with AI"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-300"
            />
            <ErrorMsg msg={errors.description?.message} />
            <GenerateAIBtn
              onClick={handleGenerateDesc}
              loading={generatingDesc}
              disabled={!watchTitle}
            />
          </div>

          {/* ── ONE-TO-ONE ONLY FIELDS ─────────────────────── */}
          {!isWebinar && (
            <>
              {/* Call Duration */}
              <div>
                <Label required>Call Duration (In Minutes)</Label>
                <Controller
                  name="callDuration"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div className="flex gap-2.5 flex-wrap">
                      {DURATIONS.map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => field.onChange(d.value)}
                          className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-150 ${
                            field.value === d.value
                              ? "border-blue-600 text-blue-600 bg-blue-50"
                              : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  )}
                />
                {watchDuration === "custom" && (
                  <input
                    {...register("customDuration", {
                      required: "Enter custom duration.",
                      min: { value: 5, message: "Minimum 5 minutes." },
                    })}
                    type="number"
                    placeholder="Enter minutes"
                    className="mt-3 w-40 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                <ErrorMsg msg={errors.customDuration?.message} />
              </div>

              {/* Cover Image */}
              <CoverUpload
                coverPreview={coverPreview}
                onFileChange={handleCoverChange}
                onDrop={handleDrop}
              />

              {/* Price row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label required>Price (₹)</Label>
                  <input
                    {...register("price", {
                      required: "Price is required.",
                      min: { value: 0, message: "Must be positive." },
                    })}
                    type="number"
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMsg msg={errors.price?.message} />
                </div>
                <div>
                  <Label>Discounted Price (₹)</Label>
                  <input
                    {...register("discountedPrice", {
                      min: { value: 0, message: "Must be positive." },
                    })}
                    type="number"
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMsg msg={errors.discountedPrice?.message} />
                </div>
              </div>

              {/* Buffer Time */}
              <div>
                <Label required>
                  Buffer Time (Idle time between 2 consecutive sessions)
                </Label>
                <Controller
                  name="bufferTime"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <select
                        {...field}
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                      >
                        {BUFFER_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        ▾
                      </span>
                    </div>
                  )}
                />
              </div>

              {/* Skills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Skills ({watchSkills.length}/10)</Label>
                  {watchSkills.length === 0 && (
                    <span className="text-xs text-orange-500 font-semibold">
                      Please add at least one skill
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  Add skills (up to 10) that would be covered under this service
                </p>
                {watchSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {watchSkills.map((s) => (
                      <span
                        key={s}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => removeSkill(s)}
                          className="text-blue-400 hover:text-blue-700 leading-none"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <div
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors"
                    onClick={() => setShowSkillDrop((v) => !v)}
                  >
                    <span className="text-sm text-gray-400">Choose skills</span>
                    <span className="text-gray-400 text-sm">▾</span>
                  </div>
                  {showSkillDrop && (
                    <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-2xl shadow-xl max-h-52 overflow-y-auto">
                      <div className="p-2 border-b border-gray-100">
                        <input
                          autoFocus
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="Search skills..."
                          className="w-full px-3 py-2 text-sm text-gray-700 focus:outline-none rounded-xl bg-gray-50"
                        />
                      </div>
                      {filteredSkills.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-4">
                          No skills found
                        </p>
                      ) : (
                        filteredSkills.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => addSkill(s)}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            {s}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Questions */}
              <div>
                <Label required>
                  Question(s) that you want to ask the mentee while booking the
                  session.
                </Label>
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <FieldRow
                      key={field.id}
                      index={index}
                      control={control}
                      errors={errors}
                      remove={remove}
                      duplicate={duplicateQuestion}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    append({ type: "textarea", label: "", required: false })
                  }
                  className="mt-3 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 text-base leading-none">
                    +
                  </span>
                  Add Question
                </button>
              </div>
            </>
          )}

          {/* ── WEBINAR ONLY FIELDS ────────────────────────── */}
          {isWebinar && (
            <>
              {/* Instructions — Quill rich text */}
              <div>
                <Label>Instruction</Label>
                <div
                  className={`border rounded-2xl overflow-hidden ${errors.instructions ? "border-red-500" : "border-gray-200"}`}
                >
                  <Controller
                    name="instructions"
                    control={control}
                    rules={{
                      validate: (v) =>
                        !v || v === "<p><br></p>" ? true : true, // optional field
                    }}
                    render={({ field }) => (
                      <QuillEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Add instructions for attendees..."
                      />
                    )}
                  />
                </div>
                <ErrorMsg msg={errors.instructions?.message} />
              </div>

              {/* Webinar Date */}
              <div>
                <Label required>Webinar Date</Label>
                <input
                  {...register("webinarDate", {
                    required: "Webinar date is required.",
                  })}
                  type="datetime-local"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMsg msg={errors.webinarDate?.message} />
              </div>

              {/* Cover Image */}
              <CoverUpload
                coverPreview={coverPreview}
                onFileChange={handleCoverChange}
                onDrop={handleDrop}
              />

              {/* Webinar Duration */}
              <div>
                <Label required>Webinar Duration (min.)</Label>
                <input
                  {...register("webinarDuration", {
                    required: "Duration is required.",
                    min: { value: 10, message: "Minimum 10 minutes." },
                  })}
                  type="number"
                  placeholder="30"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMsg msg={errors.webinarDuration?.message} />
              </div>

              {/* Price row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label required>Price (₹)</Label>
                  <input
                    {...register("price", {
                      required: "Price is required.",
                      min: { value: 0, message: "Must be positive." },
                    })}
                    type="number"
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMsg msg={errors.price?.message} />
                </div>
                <div>
                  <Label>Discounted Price (₹)</Label>
                  <input
                    {...register("discountedPrice", {
                      min: { value: 0, message: "Must be positive." },
                    })}
                    type="number"
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMsg msg={errors.discountedPrice?.message} />
                </div>
              </div>

              {/* Webinar URL */}
              <div>
                <Label required>Webinar URL</Label>
                <input
                  {...register("webinarURL", {
                    required: "Joining link is required.",
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Must be a valid URL starting with https://",
                    },
                  })}
                  placeholder="https://"
                  className={`w-full border rounded-2xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.webinarURL ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.webinarURL && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium text-right">
                    {errors.webinarURL.message}
                  </p>
                )}
              </div>

              {/* Booking notifications toggle */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-semibold text-gray-700">
                  Receive booking notifications for this service
                </span>
                <Controller
                  name="bookingNotifications"
                  control={control}
                  render={({ field: f }) => (
                    <button
                      type="button"
                      onClick={() => f.onChange(!f.value)}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${f.value ? "bg-blue-600" : "bg-gray-300"}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${f.value ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                  )}
                />
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-5 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-8 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-full transition-colors shadow-sm"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
