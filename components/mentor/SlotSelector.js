const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toAmPm = (time) => {
  const [h, m] = time.split(":").map(Number);
  const ampm = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
};

export default function SlotSelector({ slots, selected, onToggle, loading }) {
  if (loading) {
    return (
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-36 rounded-xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <span className="text-xl">⚠️</span>
        <div>
          <p className="text-sm font-semibold text-amber-700">
            No free slots available
          </p>
          <p className="text-xs text-amber-600 mt-0.5">
            Go to <span className="font-bold">Availability</span> settings to
            add slots first.
          </p>
        </div>
      </div>
    );
  }

  // Group by day
  const byDay = slots.reduce((acc, slot) => {
    const day = slot.dayOfWeek;
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(byDay)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([day, daySlots]) => (
          <div key={day}>
            {/* Day label */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              {DAY_NAMES[Number(day)]}
            </p>
            <div className="flex flex-wrap gap-2">
              {daySlots.map((slot) => {
                const isSelected = selected.includes(slot.id);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => onToggle(slot.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-150
                      ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
                      }`}
                  >
                    {isSelected && <span className="text-blue-600">✓</span>}
                    {toAmPm(slot.startTime)} – {toAmPm(slot.endTime)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      {/* Selection count */}
      {selected.length > 0 && (
        <p className="text-xs text-blue-600 font-semibold">
          {selected.length} slot{selected.length > 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}
