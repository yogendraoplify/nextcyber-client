"use client";
import SelectField from "@/components/SelectField";
import {
  mentorAvailabilityApi,
  mentorAvailabilityCreateApi,
  mentorAvailabilityDeleteApi,
  mentorAvailabilityUpdateApi,
} from "@/services/mentorApi";
import { Cross, CrossIcon, PlusIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

// ─── Constants ───────────────────────────────────────────
const DAYS = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 0 },
];

const TIMESLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  const ampm = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return {
    label: `${String(hour).padStart(2, "0")}:${m} ${ampm} IST`,
    value: `${String(h).padStart(2, "0")}:${m}`,
  };
});

// ─── API helpers ─────────────────────────────────────────
const api = {
  getSlots: () => fetch("/api/availability").then((r) => r.json()),
  updateSlots: (slots) =>
    fetch("/api/availability", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slots }),
    }).then((r) => r.json()),
  addSlot: (slot) =>
    fetch("/api/availability/slot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slot),
    }).then((r) => r.json()),
  deleteSlot: (id) =>
    fetch(`/api/availability/slot/${id}`, { method: "DELETE" }).then((r) =>
      r.json(),
    ),
};

// ─── Toast ───────────────────────────────────────────────
const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all duration-300
      ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}
    >
      <span>{toast.type === "error" ? "✕" : "✓"}</span>
      {toast.msg}
    </div>
  );
};

// ─── Add Slot Modal ──────────────────────────────────────
const AddSlotModal = ({ day, onClose, onAdd }) => {
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { startTime: "09:00", endTime: "09:30" },
  });

  const startTime = watch("startTime");

  const onSubmit = async (data) => {
    if (data.startTime >= data.endTime) {
      setError("endTime", { message: "End time must be after start time." });
      return;
    }
    try {
      const res = await mentorAvailabilityCreateApi({
        dayOfWeek: day.value,
        startTime: data.startTime,
        endTime: data.endTime,
      });
      if (!res.data.success) throw new Error(res.message);
      onAdd(res.data.slot);
      onClose();
    } catch (e) {
      console.log(e);
      setError("root", { message: e.response.data.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-g-900 w-full max-w-md shadow-2xl border border-g-400">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h3 className="text-base font-semibold text-gray-400">
              Add New Slot
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{day.label}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer border-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-6 flex gap-4">
            {/* Start time */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Start time
              </label>
              <Controller
                name="startTime"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <SelectField
                    options={TIMESLOTS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select start time"
                    isSearch={false}
                  />
                )}
              />
              {errors.startTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            {/* End time */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                End time
              </label>
              <Controller
                name="endTime"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <SelectField
                    options={TIMESLOTS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select end time"
                    isSearch={false}
                  />
                )}
              />
              {errors.endTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Root error */}
          {errors.root && (
            <p className="px-6 pb-2 text-red-500 text-sm">
              {errors.root.message}
            </p>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4  bg-g-900">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? "Adding..." : "Add Slot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Slot Row ─────────────────────────────────────────────
const SlotRow = ({ slot, onChange, onDelete }) => {
  const isAssigned = !!slot.oneToOneServiceId;

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Start */}
      <SelectField
        label={"START TIME"}
        options={TIMESLOTS}
        value={slot.startTime}
        placeholder="Select start time"
        isSearch={false}
        onChange={(value) =>
          onChange({
            ...slot,
            startTime: value,
          })
        }
      />

      {/* End */}
      <SelectField
        label={"END TIME"}
        options={TIMESLOTS}
        value={slot.endTime}
        placeholder="Select end time"
        isSearch={false}
        onChange={(value) =>
          onChange({
            ...slot,
            endTime: value,
          })
        }
      />

      {/* Action */}
      <div className="flex items-end justify-end">
        {isAssigned ? (
          <span
            title={`Assigned to - ${slot.oneToOneService?.mentorService?.title}`}
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full"
          >
            Assigned
          </span>
        ) : (
          <button
            onClick={() => onDelete(slot.id)}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-full border-2 border-dark-red transition-all text-lg font-light flex-shrink-0 cursor-pointer"
            title="Remove slot"
          >
            <X size={20} className="text-dark-red" />
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Day Card ─────────────────────────────────────────────
const DayCard = ({
  day,
  slots,
  enabled,
  onToggle,
  onSlotChange,
  onSlotDelete,
  onAddClick,
}) => (
  <div
    className={`flex items-start flex-col gap-2.5 border border-g-400 rounded-md px-2.5 py-2.5 transition-opacity duration-200 ${!enabled ? "opacity-50" : ""}`}
  >
    <div className="w-full flex items-center">
      {/* Checkbox + Day */}
      <div className="flex items-center gap-3 min-w-[140px]">
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => onToggle(day.value)}
          className="w-5 h-5 accent-blue-600 cursor-pointer rounded"
        />
        <span className="text-base font-semibold text-gray-300 ">
          {day.label}
        </span>
      </div>

      {/* Add button */}
      {enabled && (
        <button
          onClick={() => onAddClick(day)}
          className="ml-auto w-8 h-8 flex items-center justify-center rounded-full border-2 border-g-200 transition-all text-lg font-light flex-shrink-0 cursor-pointer"
          title="Add slot"
        >
          <PlusIcon size={20} className="text-g-200" />
        </button>
      )}
    </div>

    {/* Slots */}
    <div className="flex flex-col gap-4 w-full">
      {enabled && slots.length > 0 ? (
        slots.map((slot) => (
          <SlotRow
            key={slot.id}
            slot={slot}
            onChange={onSlotChange}
            onDelete={onSlotDelete}
          />
        ))
      ) : enabled ? (
        <span className="text-sm text-gray-300 italic">
          No slots! Click add button to create slot.
        </span>
      ) : null}
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────
export default function AvailabilityManager() {
  const [allSlots, setAllSlots] = useState([]);
  const [enabledDays, setEnabledDays] = useState(new Set());
  const [modalDay, setModalDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [dirtySlots, setDirtySlots] = useState(new Set());

  console.log("All slots:", allSlots);

  // react-hook-form for the Save action
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    mentorAvailabilityApi()
      .then((res) => {
        console.log("API response:", res);
        if (res.data.success) {
          setAllSlots(res.data.availability.all);
          setEnabledDays(
            new Set(res.data.availability.all.map((s) => s.dayOfWeek)),
          );
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const slotsByDay = (dayValue) =>
    allSlots.filter((s) => s.dayOfWeek === dayValue);

  const toggleDay = (dayValue) => {
    setEnabledDays((prev) => {
      const next = new Set(prev);
      next.has(dayValue) ? next.delete(dayValue) : next.add(dayValue);
      return next;
    });
  };

  const handleSlotChange = (updated) => {
    setAllSlots((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setDirtySlots((prev) => new Set(prev).add(updated.id));
  };

  const handleSlotDelete = async (slotId) => {
    try {
      const res = await mentorAvailabilityDeleteApi(slotId);
      if (!res.data.success) throw new Error(res.data.message);
      setAllSlots((prev) => prev.filter((s) => s.id !== slotId));
      showToast("Slot removed.");
    } catch (e) {
      showToast(e.response.data.message, "error");
    }
  };

  const handleSlotAdded = (newSlot) => {
    setAllSlots((prev) => [...prev, newSlot]);
    showToast("Slot added.");
  };

  // react-hook-form onSubmit for Save
  const onSave = async () => {
    const toUpdate = allSlots.filter((s) => dirtySlots.has(s.id));
    if (!toUpdate.length) {
      showToast("Nothing changed.");
      return;
    }
    try {
      const res = await mentorAvailabilityUpdateApi(
        toUpdate.map((s) => ({
          id: s.id,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
        })),
      );
      if (!res.data.success) throw new Error(res.data.message);
      setDirtySlots(new Set());
      showToast("Availability saved!");
    } catch (e) {
      showToast(e.response.data.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Loading availability...
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h2 className="text-xl font-bold text-white">My Availability</h2>
          <p className="text-sm text-g-200 mt-1">
            Manage when you're available for one to one sessions.
          </p>
        </div>
        <div className="w-1/2 flex items-center gap-5">
          <SelectField
            options={["Asia/Kolkata IST (+05:30)"]}
            placeholder="Select Time Zone"
          />
          <button
            onClick={handleSubmit(onSave)}
            disabled={isSubmitting}
            className="py-4 px-5 w-fit text-sm leading-5 rounded-lg border border-primary bg-primary text-white text-left min-h-[48px] flex items-center justify-between cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {dirtySlots.size > 0 && (
        <p className="text-xs text-amber-500 pt-2 pb-4">
          You have unsaved changes! Click Save to apply.
        </p>
      )}

      {/* Day Cards */}
      <div className="flex flex-col gap-3">
        {DAYS.map((day) => (
          <DayCard
            key={day.value}
            day={day}
            slots={slotsByDay(day.value)}
            enabled={enabledDays.has(day.value)}
            onToggle={toggleDay}
            onSlotChange={handleSlotChange}
            onSlotDelete={handleSlotDelete}
            onAddClick={setModalDay}
          />
        ))}
      </div>

      {/* Unsaved indicator */}

      {/* Add Slot Modal */}
      {modalDay && (
        <AddSlotModal
          day={modalDay}
          onClose={() => setModalDay(null)}
          onAdd={handleSlotAdded}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
