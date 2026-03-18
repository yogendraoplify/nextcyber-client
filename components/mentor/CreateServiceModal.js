"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import QuillEditor from "@/components/QuillEditor";
import {
  createOneToOneService,
  createWebinarService,
  mentorAvailabilityApi,
  updateOneToOneService,
  updateWebinarService,
} from "@/services/mentorApi";
import SlotSelector from "./SlotSelector";

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

function formatLocalDate(dateString) {
  const d = new Date(dateString);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const FIELD_TYPES = [
  { label: "Paragraph (Text Area)", value: "textarea" },
  { label: "Short Answer", value: "text" },
  { label: "Multiple Choice", value: "radio" },
];

// ─── Sub-components ──────────────────────────────────────
const Label = ({ children, required }) => (
  <p className="block text-sm font-semibold text-gray-300 mb-2">
    {children}
    {required && <span className="text-red-400 ml-1">*</span>}
  </p>
);

const ErrorMsg = ({ msg }) =>
  msg ? <p className="text-red-400 text-xs mt-1.5 font-medium">{msg}</p> : null;

const FieldRow = ({ index, control, errors, remove, duplicate }) => (
  <div className="flex items-center gap-3">
    {/* Question input */}
    <div className="flex-1">
      <Controller
        name={`questions.${index}`}
        control={control}
        rules={{ required: "Question is required." }}
        render={({ field: f }) => (
          <input
            {...f}
            placeholder={`Question ${index + 1} — e.g. What do you expect from this session?`}
            className="w-full border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-200 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          />
        )}
      />
      <ErrorMsg msg={errors?.questions?.[index]?.label?.message} />
    </div>

    {/* Duplicate */}
    <button
      type="button"
      onClick={() => duplicate(index)}
      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-700 text-gray-400 transition-colors text-sm flex-shrink-0"
      title="Duplicate"
    >
      ⧉
    </button>

    {/* Remove */}
    <button
      type="button"
      onClick={() => remove(index)}
      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-900/50 text-red-400 transition-colors font-bold text-base flex-shrink-0"
      title="Remove"
    >
      ✕
    </button>
  </div>
);

// ─── Cover Image Upload ───────────────────────────────────
const CoverUpload = ({ coverPreview, onFileChange, onDrop }) => {
  const ref = useRef(null);
  return (
    <div>
      <Label>Add Cover Image</Label>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => ref.current?.click()}
        className="border-2 border-dashed border-gray-600 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-blue-500 hover:bg-blue-900/10 transition-all"
      >
        {coverPreview ? (
          <img
            src={coverPreview}
            className="h-20 rounded-xl object-cover w-full max-w-xs"
            alt="cover"
          />
        ) : (
          <>
            <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center text-blue-400 text-xl flex-shrink-0">
              ☁
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-300">
                <span className="text-blue-400">Upload</span> or drop
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
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

// ─── AI Generate Button ───────────────────────────────────
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
  editData,
}) {
  const coverFileRef = useRef(null);
  const [serviceType, setServiceType] = useState(
    editData ? editData.type : "ONE_TO_ONE",
  );
  const [coverPreview, setCoverPreview] = useState(
    editData?.coverImage?.url ?? null,
  );
  const [skillInput, setSkillInput] = useState("");
  const [showSkillDrop, setShowSkillDrop] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);

  // ─── Add this state at the top of CreateServiceModal ─────
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const isWebinar = serviceType === "WEBINAR";
  const isEditing = !!editData;

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
      title: editData?.title ?? "",
      description: editData?.description ?? "",
      price: editData?.price ?? "",
      discountedPrice: editData?.discountedPrice ?? "",
      // one-to-one
      callDuration: editData?.oneToOneDetails?.callDuration ?? 30,
      customDuration: editData?.oneToOneDetails?.customDuration ?? "",
      bufferTime: editData?.oneToOneDetails?.bufferTime ?? 0,
      skills: editData?.oneToOneDetails?.skills ?? [],
      questions: editData?.oneToOneDetails?.questions ?? [
        "What do you expect from this session?",
      ],
      // webinar
      instructions: editData?.webinarDetails?.instructions ?? "",
      webinarDate: formatLocalDate(editData?.webinarDetails?.webinarDate) ?? "",
      webinarDuration: editData?.webinarDetails?.webinarDuration ?? 30,
      // webinarURL: editData?.webinarDetails?.webinarURL ?? "",
      // bookingNotifications:
      // editData?.webinarDetails?.bookingNotifications ?? true,
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
    coverFileRef.current = file;
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
    await new Promise((r) => setTimeout(r, 1500));
    setValue(
      "description",
      `A comprehensive ${watchTitle} session where you'll get personalized guidance, actionable feedback, and expert insights tailored to your specific needs and goals.`,
    );
    setGeneratingDesc(false);
  };

  // ── Duplicate question ───────────────────────────────
  // duplicateQuestion
  const duplicateQuestion = (index) => append(getValues(`questions.${index}`));

  // ── Submit ───────────────────────────────────────────
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
          // webinarURL: data.webinarURL,
          // bookingNotifications: data.bookingNotifications,
        }
      : {
          ...base,
          callDuration:
            data.callDuration === "custom"
              ? parseInt(data.customDuration)
              : parseInt(data.callDuration),
          bufferTime: parseInt(data.bufferTime),
          skills: data.skills,
          questions: data.questions.map((q) => q),
          availabilityIds: selectedSlots, // ✅ send selected slot IDs
        };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    if (coverFileRef.current) {
      formData.append("coverImage", coverFileRef.current);
    }

    try {
      if (isEditing) {
        if (isWebinar) {
          await updateWebinarService(editData.id, formData);
        } else {
          await updateOneToOneService(editData.id, formData);
        }
      } else {
        if (isWebinar) {
          await createWebinarService(formData);
        } else {
          await createOneToOneService(formData);
        }
      }
      // await onSubmitProp?.(formData);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  // ─── Initialize selectedSlots with already assigned slots when editing ────
  useEffect(() => {
    if (editData?.oneToOneDetails?.availability?.length > 0) {
      const assignedIds = editData.oneToOneDetails.availability.map(
        (s) => s.id,
      );
      setSelectedSlots(assignedIds);
    }
  }, [editData]);

  useEffect(() => {
    if (isWebinar) return;
    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const res = await mentorAvailabilityApi();
        // only show free (unassigned) slots — assigned ones belong to other services
        const free = res.data.availability.free ?? [];

        // When editing — merge in this service's own assigned slots
        // so they appear in the selector and can be re-selected/deselected
        const ownSlots = editData?.oneToOneDetails?.availability ?? [];

        // Combine free + own slots, deduplicate by id
        const combined = [
          ...free,
          ...ownSlots.filter((own) => !free.find((f) => f.id === own.id)),
        ];

        setAvailableSlots(combined);
      } catch {
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [isWebinar]);

  // ─── Toggle slot selection ────────────────────────────────
  const toggleSlot = (slotId) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId],
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "Edit Service" : "Add your Service"}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors text-lg"
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
                  disabled={isEditing}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-150 disabled:cursor-not-allowed ${
                    serviceType === t.value
                      ? "border-blue-500 text-blue-400 bg-blue-900/30"
                      : "border-gray-600 text-gray-400 hover:border-gray-500"
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
              className="w-full border border-gray-600 rounded-2xl px-4 py-3 text-sm text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
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
              className="w-full border border-gray-600 rounded-2xl px-4 py-3 text-sm text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-500"
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
                              ? "border-blue-500 text-blue-400 bg-blue-900/30"
                              : "border-gray-600 text-gray-400 hover:border-gray-500"
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
                    className="mt-3 w-40 border border-gray-600 rounded-2xl px-4 py-2.5 text-sm text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-600 rounded-2xl px-4 py-3 text-sm text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-600 rounded-2xl px-4 py-3 text-sm text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full border border-gray-600 rounded-2xl px-4 py-3 text-sm text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                      >
                        {BUFFER_OPTIONS.map((o) => (
                          <option
                            key={o.value}
                            value={o.value}
                            className="bg-gray-800"
                          >
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
                    <span className="text-xs text-orange-400 font-semibold">
                      Please add at least one skill
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Add skills (up to 10) that would be covered under this service
                </p>
                {watchSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {watchSkills.map((s) => (
                      <span
                        key={s}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/40 text-blue-300 text-xs font-semibold rounded-full border border-blue-700"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => removeSkill(s)}
                          className="text-blue-400 hover:text-blue-200 leading-none"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <div
                    className="w-full border border-gray-600 rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors bg-gray-800"
                    onClick={() => setShowSkillDrop((v) => !v)}
                  >
                    <span className="text-sm text-gray-500">Choose skills</span>
                    <span className="text-gray-400 text-sm">▾</span>
                  </div>
                  {showSkillDrop && (
                    <div className="absolute z-20 top-full mt-1 w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-h-52 overflow-y-auto">
                      <div className="p-2 border-b border-gray-700">
                        <input
                          autoFocus
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="Search skills..."
                          className="w-full px-3 py-2 text-sm text-gray-200 focus:outline-none rounded-xl bg-gray-700 placeholder-gray-500"
                        />
                      </div>
                      {filteredSkills.length === 0 ? (
                        <p className="text-xs text-gray-500 text-center py-4">
                          No skills found
                        </p>
                      ) : (
                        filteredSkills.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => addSkill(s)}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-blue-900/40 hover:text-blue-300 transition-colors"
                          >
                            {s}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Availability Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Availability Slots</Label>
                  {selectedSlots.length === 0 &&
                    !slotsLoading &&
                    availableSlots.length > 0 && (
                      <span className="text-xs text-orange-500 font-semibold">
                        Select at least one slot
                      </span>
                    )}
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Select which of your free availability slots apply to this
                  service
                </p>
                <SlotSelector
                  slots={availableSlots}
                  selected={selectedSlots}
                  onToggle={toggleSlot}
                  loading={slotsLoading}
                />
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
                  onClick={() => append("")}
                  className="mt-3 flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-blue-500 text-blue-400 text-base leading-none">
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
                  className={`border rounded-2xl overflow-hidden ${errors.instructions ? "border-red-500" : "border-gray-600"}`}
                >
                  <Controller
                    name="instructions"
                    control={control}
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
                  className="w-full border border-gray-600 rounded-2xl px-4 py-3 text-sm text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
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
                  className="w-full border border-gray-600 rounded-2xl px-4 py-3 text-sm text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-600 rounded-2xl px-4 py-3 text-sm text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-600 rounded-2xl px-4 py-3 text-sm text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMsg msg={errors.discountedPrice?.message} />
                </div>
              </div>

              {/* Webinar URL */}
              {/* <div>
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
                  className={`w-full border rounded-2xl px-4 py-3 text-sm text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 ${
                    errors.webinarURL ? "border-red-500" : "border-gray-600"
                  }`}
                />
                <ErrorMsg msg={errors.webinarURL?.message} />
              </div> */}

              {/* Booking notifications toggle */}
              {/* <div className="flex items-center justify-between py-2">
                <span className="text-sm font-semibold text-gray-300">
                  Receive booking notifications for this service
                </span>
                <Controller
                  name="bookingNotifications"
                  control={control}
                  render={({ field: f }) => (
                    <button
                      type="button"
                      onClick={() => f.onChange(!f.value)}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${f.value ? "bg-blue-600" : "bg-gray-600"}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${f.value ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                  )}
                />
              </div> */}
            </>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-5 border-t border-gray-800 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-full hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-8 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-full transition-colors shadow-sm"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
