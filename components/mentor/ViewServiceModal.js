import React from "react";

const ViewServiceModal = ({ service, onClose }) => {
  if (!service) return null;

  const isWebinar = service.type === "WEBINAR";
  const details = isWebinar ? service.webinarDetails : service.oneToOneDetails;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* ── Cover Image / Header ───────────────────── */}
        <div className="relative h-40 bg-gradient-to-br from-blue-500 to-cyan-400 flex-shrink-0">
          {service.coverImage?.url ? (
            <img
              src={service.coverImage.url}
              className="w-full h-full object-cover"
              alt={service.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
              {isWebinar ? "🎙" : "📹"}
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Type badge */}
          <div
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white
            ${
              isWebinar
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "bg-gradient-to-r from-blue-500 to-cyan-400"
            }`}
          >
            {isWebinar ? "Webinar" : "1:1 Call"}
          </div>

          {/* Status badge */}
          <div
            className={`absolute top-4 right-12 px-3 py-1 rounded-full text-xs font-bold
            ${
              service.isActive
                ? "bg-emerald-500 text-white"
                : "bg-gray-400 text-white"
            }`}
          >
            {service.isActive ? "Active" : "Inactive"}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors text-sm"
          >
            ✕
          </button>

          {/* Title on cover */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-lg font-bold text-white leading-tight">
              {service.title}
            </h2>
          </div>
        </div>

        {/* ── Scrollable Body ────────────────────────── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Price row */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">
              ₹{service.price}
            </span>
            {service.discountedPrice && (
              <>
                <span className="text-base text-gray-400 line-through">
                  ₹{service.discountedPrice}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {Math.round(
                    ((service.price - service.discountedPrice) /
                      service.price) *
                      100,
                  )}
                  % off
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Description
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* ── ONE-TO-ONE details ─────────────────── */}
          {!isWebinar && (
            <>
              {/* Meta pills */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                  ⏱ {details?.callDuration} min duration
                </span>
                {details?.bufferTime > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">
                    🕐 {details.bufferTime} min buffer
                  </span>
                )}
              </div>

              {/* Skills */}
              {details?.skills?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Skills Covered
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {details.skills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions */}
              {details?.questions?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Pre-booking Questions
                  </p>
                  <div className="space-y-2">
                    {details.questions.map((q, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-gray-700">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability slots */}
              {details?.availability?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Availability Slots
                  </p>
                  {(() => {
                    const DAY_NAMES = [
                      "Sun",
                      "Mon",
                      "Tue",
                      "Wed",
                      "Thu",
                      "Fri",
                      "Sat",
                    ];
                    const byDay = details.availability.reduce((acc, slot) => {
                      const d = slot.dayOfWeek;
                      if (!acc[d]) acc[d] = [];
                      acc[d].push(slot);
                      return acc;
                    }, {});
                    const toAmPm = (t) => {
                      const [h, m] = t.split(":").map(Number);
                      const ap = h < 12 ? "AM" : "PM";
                      const hr = h % 12 === 0 ? 12 : h % 12;
                      return `${String(hr).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ap}`;
                    };
                    return (
                      <div className="space-y-2">
                        {Object.entries(byDay)
                          .sort(([a], [b]) => Number(a) - Number(b))
                          .map(([day, slots]) => (
                            <div
                              key={day}
                              className="flex items-center gap-2 flex-wrap"
                            >
                              <span className="text-xs font-bold text-gray-500 w-8">
                                {DAY_NAMES[Number(day)]}
                              </span>
                              {slots.map((slot) => (
                                <span
                                  key={slot.id}
                                  className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100"
                                >
                                  {toAmPm(slot.startTime)} –{" "}
                                  {toAmPm(slot.endTime)}
                                </span>
                              ))}
                            </div>
                          ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </>
          )}

          {/* ── WEBINAR details ────────────────────── */}
          {isWebinar && (
            <>
              {/* Meta pills */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100">
                  📅{" "}
                  {new Date(details?.webinarDate).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-700 text-xs font-semibold rounded-full border border-pink-100">
                  ⏱ {details?.webinarDuration} min
                </span>
                {details?.status && (
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border
                    ${
                      details.status === "LIVE"
                        ? "bg-red-50 text-red-600 border-red-200"
                        : details.status === "COMPLETED"
                          ? "bg-gray-50 text-gray-500 border-gray-200"
                          : details.status === "CANCELLED"
                            ? "bg-orange-50 text-orange-600 border-orange-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {details.status === "LIVE" && (
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    )}
                    {details.status}
                  </span>
                )}
              </div>

              {/* Instructions */}
              {details?.instructions &&
                details.instructions !== "<p><br></p>" && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Instructions
                    </p>
                    <div
                      className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: details.instructions }}
                    />
                  </div>
                )}

              {/* Registrations count */}
              {details?._count?.registrations !== undefined && (
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <span className="text-xl">👥</span>
                  <div>
                    <p className="text-sm font-bold text-purple-800">
                      {details._count.registrations} Registered
                    </p>
                    <p className="text-xs text-purple-600">
                      Total registrations so far
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Created{" "}
            {new Date(service.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewServiceModal;
