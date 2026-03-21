"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  getSessions,
  getSessionsStats,
  getWebinarBookings,
} from "@/services/mentorApi";
import Link from "next/link";

const api = {
  getSessions: (params) =>
    axios.get("/api/sessions/mentor", { params }).then((r) => r.data),

  getWebinarBookings: (params) =>
    axios
      .get("/api/webinar/mentor/registrations", { params })
      .then((r) => r.data),

  getSessionStats: () =>
    axios.get("/api/sessions/mentor/stats").then((r) => r.data),

  cancelSession: (id) =>
    axios.patch(`/api/sessions/${id}/cancel`).then((r) => r.data),
};

// ─── Helpers ──────────────────────────────────────────────
const fmt = {
  date: (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  time: (d) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  dateTime: (d) => `${fmt.date(d)}, ${fmt.time(d)}`,
  currency: (n, c = "INR") =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: c,
      maximumFractionDigits: 0,
    }).format(n),
};

// ─── Status config ────────────────────────────────────────
const SESSION_STATUS = {
  PENDING: {
    label: "Pending",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/30",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/30",
  },
  ONGOING: {
    label: "Live",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/30",
    pulse: true,
  },
  COMPLETED: {
    label: "Completed",
    color: "text-gray-400",
    bg: "bg-gray-400/10 border-gray-400/30",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/30",
  },
  NO_SHOW: {
    label: "No Show",
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/30",
  },
};

const WEBINAR_STATUS = {
  REGISTERED: {
    label: "Registered",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/30",
  },
  ATTENDED: {
    label: "Attended",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/30",
  },
  ABSENT: {
    label: "Absent",
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/30",
  },
  PENDING: {
    label: "Pending",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/30",
  },
  REFUNDED: {
    label: "Refunded",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/30",
  },
};

const StatusBadge = ({ status, type = "session" }) => {
  const map = type === "session" ? SESSION_STATUS : WEBINAR_STATUS;
  const config = map[status] ?? {
    label: status,
    color: "text-gray-400",
    bg: "bg-gray-400/10 border-gray-400/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.color}`}
    >
      {config.pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      )}
      {config.label}
    </span>
  );
};

// ─── Stat Card ────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, accent }) => (
  <div
    className={`relative bg-gray-900 border rounded-2xl p-5 overflow-hidden ${accent ?? "border-gray-800"}`}
  >
    <div
      className="absolute inset-0 opacity-5"
      style={{
        background:
          "radial-gradient(circle at top right, #60a5fa, transparent 70%)",
      }}
    />
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  </div>
);

// ─── Avatar ───────────────────────────────────────────────
const Avatar = ({ src, name, size = "md" }) => {
  const sz =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "lg"
        ? "w-12 h-12 text-base"
        : "w-10 h-10 text-sm";
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";
  return src ? (
    <img
      src={src}
      className={`${sz} rounded-full object-cover ring-2 ring-gray-800`}
      alt={name}
    />
  ) : (
    <div
      className={`${sz} rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white ring-2 ring-gray-800`}
    >
      {initials}
    </div>
  );
};

// ─── Session Row Card ─────────────────────────────────────
const SessionCard = ({ item, type, onClick }) => {
  const isWebinar = type === "WEBINAR";
  const student = isWebinar ? item.student : item.student;
  const studentUser = student?.user;
  const service = isWebinar
    ? item.webinarService?.mentorService
    : item.oneToOneService?.mentorService;

  const scheduledAt = isWebinar
    ? item.webinarService?.webinarDate
    : item.scheduledAt;

  const duration = isWebinar
    ? item.webinarService?.webinarDuration
    : item.duration;

  const status = item.status;

  const showJoinBtn = item.status === "CONFIRMED" || item.status === "ONGOING";

  return (
    <div
      onClick={() => onClick(item)}
      className="group flex items-center gap-4 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl px-5 py-4 cursor-pointer transition-all duration-200 hover:bg-gray-800/80"
    >
      {/* Avatar */}
      <Avatar
        src={studentUser?.profilePicture?.url}
        name={`${studentUser?.firstName} ${studentUser?.lastName}`}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-white truncate">
            {studentUser?.firstName} {studentUser?.lastName}
          </p>
          <StatusBadge
            status={status}
            type={isWebinar ? "webinar" : "session"}
          />

          {!isWebinar && showJoinBtn && (
            <Link href={`/mentor/join-session/${item?.id}`} className="text-xs">
              Start Session
            </Link>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">
          {service?.title ?? "—"}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-gray-600">
            📅 {scheduledAt ? fmt.dateTime(scheduledAt) : "—"}
          </span>
          {duration && (
            <span className="flex items-center gap-1 text-xs text-gray-600">
              ⏱ {duration} min
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-white">
          {isWebinar
            ? fmt.currency(service?.price ?? 0, service?.currency ?? "INR")
            : fmt.currency(item.price ?? 0, item.currency ?? "INR")}
        </p>
        <p className="text-[10px] text-gray-600 mt-0.5">
          {isWebinar ? "Registration" : "Session fee"}
        </p>
      </div>

      {/* Arrow */}
      <div className="text-gray-700 group-hover:text-gray-400 transition-colors flex-shrink-0">
        ›
      </div>
    </div>
  );
};

// ─── Detail Modal ─────────────────────────────────────────
const DetailModal = ({ item, type, onClose, onCancel }) => {
  if (!item) return null;

  const isWebinar = type === "WEBINAR";
  const student = item.student;
  const studentUser = student?.user;
  const service = isWebinar
    ? item.webinarService?.mentorService
    : item.oneToOneService?.mentorService;
  const details = isWebinar ? item.webinarService : item.oneToOneService;
  const scheduledAt = isWebinar ? details?.webinarDate : item.scheduledAt;
  const canCancel =
    !isWebinar && ["PENDING", "CONFIRMED"].includes(item.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-lg
              ${isWebinar ? "bg-purple-500/20" : "bg-blue-500/20"}`}
            >
              {isWebinar ? "🎙" : "📹"}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isWebinar ? "Webinar Registration" : "1-to-1 Session"}
              </h3>
              <p className="text-xs text-gray-500">
                {item.id?.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between">
            <StatusBadge
              status={item.status}
              type={isWebinar ? "webinar" : "session"}
            />
            <span className="text-xs text-gray-600">
              Booked {fmt.date(item.createdAt)}
            </span>
          </div>

          {/* Student */}
          <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-2xl border border-gray-800">
            <Avatar
              src={studentUser?.profilePicture?.url}
              name={`${studentUser?.firstName} ${studentUser?.lastName}`}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">
                {studentUser?.firstName} {studentUser?.lastName}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {studentUser?.email}
              </p>
            </div>
          </div>

          {/* Service */}
          <Section title="Service">
            <Row label="Title" value={service?.title ?? "—"} />
            <Row label="Type" value={isWebinar ? "Webinar" : "1-to-1 Call"} />
            <Row
              label="Price"
              value={
                isWebinar
                  ? fmt.currency(
                      service?.price ?? 0,
                      service?.currency ?? "INR",
                    )
                  : fmt.currency(item.price ?? 0, item.currency ?? "INR")
              }
              highlight
            />
          </Section>

          {/* Schedule */}
          <Section title="Schedule">
            <Row
              label="Date"
              value={scheduledAt ? fmt.date(scheduledAt) : "—"}
            />
            <Row
              label="Time"
              value={scheduledAt ? fmt.time(scheduledAt) : "—"}
            />
            <Row
              label="Duration"
              value={
                isWebinar
                  ? `${details?.webinarDuration} min`
                  : `${item.duration} min`
              }
            />
          </Section>

          {/* Session-only fields */}
          {!isWebinar && (
            <Section title="Call Details">
              <Row label="Payment ID" value={item.paymentId ?? "—"} mono />
              {item.answers && Object.keys(item.answers).length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
                    Pre-call Answers
                  </p>
                  <div className="space-y-2">
                    {Object.entries(item.answers).map(([q, a], i) => (
                      <div key={i} className="bg-gray-800 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">{q}</p>
                        <p className="text-sm text-gray-200">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Section>
          )}

          {/* Webinar-only fields */}
          {isWebinar && (
            <Section title="Attendance">
              <Row label="Payment ID" value={item.paymentId ?? "—"} mono />
              {item.joinedAt && (
                <Row label="Joined At" value={fmt.dateTime(item.joinedAt)} />
              )}
              {item.leftAt && (
                <Row label="Left At" value={fmt.dateTime(item.leftAt)} />
              )}
              {item.joinedAt && item.leftAt && (
                <Row
                  label="Watch Duration"
                  value={`${Math.round((new Date(item.leftAt) - new Date(item.joinedAt)) / 60000)} min`}
                />
              )}
            </Section>
          )}

          {/* Room info */}
          {item.roomId && (
            <Section title="Room">
              <Row label="Channel" value={item.roomId} mono />
            </Section>
          )}

          {/* Review (sessions only) */}
          {!isWebinar && item.review && (
            <Section title="Student Review">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${i < item.review.rating ? "text-yellow-400" : "text-gray-700"}`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-sm text-gray-400 ml-1">
                  {item.review.rating}/5
                </span>
              </div>
              {item.review.comment && (
                <p className="text-sm text-gray-400 italic">
                  "{item.review.comment}"
                </p>
              )}
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex-shrink-0 flex items-center justify-between">
          {canCancel ? (
            <button
              onClick={() => onCancel(item.id)}
              className="px-4 py-2 text-xs font-semibold text-red-400 border border-red-400/30 rounded-full hover:bg-red-400/10 transition-colors"
            >
              Cancel Session
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Detail Section helpers ───────────────────────────────
const Section = ({ title, children }) => (
  <div>
    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
      {title}
    </p>
    <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800 overflow-hidden">
      {children}
    </div>
  </div>
);

const Row = ({ label, value, highlight, mono }) => (
  <div className="flex items-center justify-between px-4 py-3">
    <span className="text-xs text-gray-500">{label}</span>
    <span
      className={`text-xs font-semibold truncate max-w-[60%] text-right
      ${highlight ? "text-emerald-400" : mono ? "text-blue-400 font-mono" : "text-gray-300"}`}
    >
      {value}
    </span>
  </div>
);

// ─── Pagination ───────────────────────────────────────────
const Pagination = ({ page, total, limit, onChange }) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-800 text-gray-500 hover:bg-gray-800 disabled:opacity-30 transition-colors"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors
            ${p === page ? "bg-blue-600 text-white border border-blue-600" : "border border-gray-800 text-gray-500 hover:bg-gray-800"}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-800 text-gray-500 hover:bg-gray-800 disabled:opacity-30 transition-colors"
      >
        ›
      </button>
    </div>
  );
};

// ─── Toast ────────────────────────────────────────────────
const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium text-white border
      ${toast.type === "error" ? "bg-red-950 border-red-800 text-red-200" : "bg-emerald-950 border-emerald-800 text-emerald-200"}`}
    >
      <span>{toast.type === "error" ? "✕" : "✓"}</span>
      {toast.msg}
    </div>
  );
};

// ─── Filter Bar ───────────────────────────────────────────
const FilterBar = ({ statusFilter, setStatusFilter, type }) => {
  const statuses =
    type === "ONE_TO_ONE"
      ? [
          "ALL",
          "PENDING",
          "CONFIRMED",
          "ONGOING",
          "COMPLETED",
          "CANCELLED",
          "NO_SHOW",
        ]
      : ["ALL", "PENDING", "REGISTERED", "ATTENDED", "ABSENT", "REFUNDED"];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => setStatusFilter(s)}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all
            ${
              statusFilter === s
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300"
            }`}
        >
          {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
        </button>
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────
const LIMIT = 10;

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState("ONE_TO_ONE");
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debounceRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 400);
  }, [search]);

  // Reset page on filter/tab change
  useEffect(() => {
    setPage(1);
  }, [activeTab, statusFilter, debouncedSearch]);

  // Fetch
  useEffect(() => {
    setStatusFilter("ALL");
    setItems([]);
    const fetch = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: LIMIT,
          ...(statusFilter !== "ALL" && { status: statusFilter }),
          ...(debouncedSearch && { search: debouncedSearch }),
        };

        const res =
          activeTab === "ONE_TO_ONE"
            ? await getSessions(params)
            : await getWebinarBookings(params);

        setItems(
          activeTab === "ONE_TO_ONE"
            ? (res.data.sessions ?? [])
            : (res.data.registrations ?? []),
        );
        setTotal(res.total ?? 0);
      } catch {
        showToast("Failed to load sessions.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeTab, page, statusFilter, debouncedSearch]);

  // Fetch stats once
  useEffect(() => {
    const fetch = async () => {
      // setLoading(true);
      try {
        const res = await getSessionsStats();
        setStats(res.data.stats);
      } catch {
        showToast("Failed to load sessions stats.", "error");
      } finally {
        // setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleCancel = async (id) => {
    try {
      await api.cancelSession(id);
      showToast("Session cancelled.");
      setSelectedItem(null);
      setItems((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "CANCELLED" } : s)),
      );
    } catch (e) {
      showToast(e.response?.data?.message ?? "Failed to cancel.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-9500">
      <div className="w-full mx-auto space-y-6">
        {/* ── Page Header ─────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold text-white">Sessions</h1>
          <p className="text-sm text-gray-500 mt-1">
            All bookings across your services
          </p>
        </div>

        {/* ── Stats ────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="📅"
            label="Total Sessions"
            value={stats?.totalSessions ?? 0}
            accent="border-blue-900/50"
          />
          <StatCard
            icon="✅"
            label="Completed"
            value={stats?.completed ?? 0}
            accent="border-emerald-900/50"
          />
          <StatCard
            icon="💰"
            label="Total Earnings"
            value={fmt.currency(stats?.totalEarnings ?? 0)}
            accent="border-yellow-900/50"
          />
          <StatCard
            icon="⭐"
            label="Avg Rating"
            value={`${stats?.avgRating ?? 0}/5`}
            sub={`${stats?.totalReviews ?? 0} reviews`}
            accent="border-purple-900/50"
          />
        </div>

        {/* ── Main Card ────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
          {/* Tab + Search header */}
          <div className="px-6 py-4 border-b border-gray-800 space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Tabs */}
              <div className="flex items-center bg-gray-950 rounded-full p-1 gap-1">
                {[
                  { label: "1-to-1 Sessions", value: "ONE_TO_ONE", icon: "📹" },
                  { label: "Webinar Bookings", value: "WEBINAR", icon: "🎙" },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                      ${
                        activeTab === tab.value
                          ? "bg-blue-600 text-white shadow"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">
                  🔍
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by student name..."
                  className="bg-gray-950 border border-gray-800 rounded-full pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
                />
              </div>
            </div>

            {/* Filter bar */}
            <FilterBar
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              type={activeTab}
            />
          </div>

          {/* List */}
          <div className="px-6 py-4 space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-800 rounded-2xl animate-pulse"
                />
              ))
            ) : items.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-5xl mb-4 opacity-30">
                  {activeTab === "WEBINAR" ? "🎙" : "📹"}
                </div>
                <p className="text-sm font-semibold text-gray-500">
                  No bookings found
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  {statusFilter !== "ALL"
                    ? "Try clearing the status filter"
                    : "Bookings will appear here once students register"}
                </p>
              </div>
            ) : (
              items.map((item) => (
                <SessionCard
                  key={item.id}
                  item={item}
                  type={activeTab}
                  onClick={setSelectedItem}
                />
              ))
            )}
          </div>

          {/* Footer — count + pagination */}
          {!loading && total > 0 && (
            <div className="px-6 pb-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">
                  Showing {Math.min((page - 1) * LIMIT + 1, total)}–
                  {Math.min(page * LIMIT, total)} of {total}
                </p>
                <p className="text-xs text-gray-600">
                  {activeTab === "ONE_TO_ONE" ? "sessions" : "registrations"}
                </p>
              </div>
              <Pagination
                page={page}
                total={total}
                limit={LIMIT}
                onChange={setPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ──────────────────────────────── */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          type={activeTab}
          onClose={() => setSelectedItem(null)}
          onCancel={handleCancel}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
