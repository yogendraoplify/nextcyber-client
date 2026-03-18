"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
// import { mentorshipApi } from "@/services/mentorshipApi";
import {
  getMyBookings,
  getMyWebinarRegistrations,
  studentMentorServicesStats,
} from "@/services/mentorApi";
import Link from "next/link";

// ─── Helpers ──────────────────────────────────────────────
const fmt = {
  currency: (n, c = "INR") =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: c,
      maximumFractionDigits: 0,
    }).format(n),
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
  timeUntil: (d) => {
    const diff = new Date(d) - new Date();
    if (diff < 0) return null;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h ${mins}m`;
    if (mins > 0) return `in ${mins}m`;
    return "Starting now";
  },
};

// ─── Status Config ────────────────────────────────────────
const STATUS_CFG = {
  // Sessions
  PENDING: {
    label: "Pending",
    dot: "bg-amber-400",
    text: "text-amber-400",
    ring: "border-amber-400/30  bg-amber-400/10",
  },
  CONFIRMED: {
    label: "Confirmed",
    dot: "bg-blue-400",
    text: "text-blue-400",
    ring: "border-blue-400/30   bg-blue-400/10",
  },
  ONGOING: {
    label: "Live",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    ring: "border-emerald-400/30 bg-emerald-400/10",
    pulse: true,
  },
  COMPLETED: {
    label: "Completed",
    dot: "bg-gray-500",
    text: "text-gray-500",
    ring: "border-gray-500/30   bg-gray-500/10",
  },
  CANCELLED: {
    label: "Cancelled",
    dot: "bg-red-400",
    text: "text-red-400",
    ring: "border-red-400/30    bg-red-400/10",
  },
  NO_SHOW: {
    label: "No Show",
    dot: "bg-orange-400",
    text: "text-orange-400",
    ring: "border-orange-400/30 bg-orange-400/10",
  },
  // Webinar
  REGISTERED: {
    label: "Registered",
    dot: "bg-purple-400",
    text: "text-purple-400",
    ring: "border-purple-400/30 bg-purple-400/10",
  },
  ATTENDED: {
    label: "Attended",
    dot: "bg-teal-400",
    text: "text-teal-400",
    ring: "border-teal-400/30   bg-teal-400/10",
  },
  ABSENT: {
    label: "Absent",
    dot: "bg-orange-400",
    text: "text-orange-400",
    ring: "border-orange-400/30 bg-orange-400/10",
  },
  REFUNDED: {
    label: "Refunded",
    dot: "bg-gray-400",
    text: "text-gray-400",
    ring: "border-gray-400/30   bg-gray-400/10",
  },
};

const Badge = ({ status }) => {
  const c = STATUS_CFG[status] ?? STATUS_CFG.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${c.ring} ${c.text}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot} ${c.pulse ? "animate-pulse" : ""}`}
      />
      {c.label}
    </span>
  );
};

// ─── Countdown chip ───────────────────────────────────────
const Countdown = ({ date }) => {
  const label = fmt.timeUntil(date);
  if (!label) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-950 border border-blue-800 rounded-full text-[10px] font-bold text-blue-400">
      ⏰ {label}
    </span>
  );
};

// ─── Skeleton ─────────────────────────────────────────────
const Skeleton = () => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse flex gap-4">
    <div className="w-14 h-14 bg-gray-800 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2.5">
      <div className="h-4 bg-gray-800 rounded-lg w-1/2" />
      <div className="h-3 bg-gray-800 rounded-lg w-1/3" />
      <div className="h-3 bg-gray-800 rounded-lg w-2/3" />
    </div>
    <div className="w-20 h-8 bg-gray-800 rounded-xl" />
  </div>
);

// ─── Booking Card ─────────────────────────────────────────
const BookingCard = ({ item, type, onClick }) => {
  const isWebinar = type === "WEBINAR";
  const service = isWebinar
    ? item.webinarService?.mentorService
    : item.oneToOneService?.mentorService;
  const details = isWebinar ? item.webinarService : item.oneToOneService;
  const mentor = service?.user;

  const scheduledAt = isWebinar ? details?.webinarDate : item.scheduledAt;
  // const canJoin = item.status === "CONFIRMED" || item.status === "ONGOING";
  const canJoin = item.status === "CONFIRMED" || item.status === "ONGOING";
  // const canJoinWebinar =
  //   item.status === "REGISTERED" && details?.status === "LIVE";
  const canJoinWebinar = details?.status === "LIVE";

  console.log("can join");
  console.log(canJoin, canJoinWebinar);

  return (
    <div
      onClick={() => onClick(item)}
      className="group relative bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:bg-gray-800/60 hover:shadow-xl hover:shadow-black/30"
    >
      {/* Live pulse glow */}
      {(item.status === "ONGOING" || details?.status === "LIVE") && (
        <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 border border-emerald-500/20" />
      )}

      <div className="relative flex items-start gap-4">
        {/* Thumbnail */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
          {service?.coverImage?.url ? (
            <img
              src={service.coverImage.url}
              className="w-full h-full object-cover"
              alt=""
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">
              {isWebinar ? "🎙" : "📹"}
            </div>
          )}
          {/* Mini type badge */}
          <div
            className={`absolute inset-x-0 bottom-0 py-0.5 text-center text-[9px] font-black text-white
            ${isWebinar ? "bg-purple-600" : "bg-blue-600"}`}
          >
            {isWebinar ? "LIVE" : "1:1"}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-bold text-white leading-snug truncate flex-1">
              {service?.title ?? "—"}
            </h3>
            <Badge status={item.status} />
          </div>

          {/* Mentor */}
          <p className="text-xs text-gray-600 mb-2">
            with{" "}
            <span className="text-gray-400 font-medium">
              {mentor?.firstName} {mentor?.lastName}
            </span>
          </p>

          {/* Date/time row */}
          <div className="flex items-center gap-3 flex-wrap">
            {scheduledAt && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                📅 {fmt.dateTime(scheduledAt)}
              </span>
            )}
            {!isWebinar && item.duration && (
              <span className="text-xs text-gray-600">
                ⏱ {item.duration} min
              </span>
            )}
            {scheduledAt && <Countdown date={scheduledAt} />}
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <p className="text-sm font-bold text-white">
            {isWebinar
              ? fmt.currency(service?.price ?? 0)
              : fmt.currency(item.price ?? 0, item.currency)}
          </p>

          {(canJoin || canJoinWebinar) && (
            <Link
              href={
                isWebinar
                  ? `/mentor/join-webinar/${details?.id}`
                  : `/mentor/join-session/${item?.id}`
              }
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/30"
            >
              Join →
            </Link>
          )}

          {/* Review prompt */}
          {item.status === "COMPLETED" && !item.review && (
            <span className="text-[10px] text-amber-500 font-semibold bg-amber-950 border border-amber-900 px-2 py-1 rounded-lg">
              ★ Leave review
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Review Modal ─────────────────────────────────────────
const ReviewModal = ({ session, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await fetch(`/api/sessions/${session.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: data.comment }),
      });
      onSubmitted();
    } catch (e) {
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white">Leave a Review</h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">
              {session.oneToOneService?.mentorService?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="text-3xl transition-transform hover:scale-110"
            >
              <span
                className={
                  (hover || rating) >= star
                    ? "text-yellow-400"
                    : "text-gray-700"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <textarea
            {...register("comment")}
            rows={3}
            placeholder="Share your experience (optional)..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-700 text-gray-400 text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!rating || isSubmitting}
              className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-gray-950 text-sm font-bold rounded-xl transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Detail Modal ─────────────────────────────────────────
const DetailModal = ({ item, type, onClose, onReview }) => {
  if (!item) return null;

  const isWebinar = type === "WEBINAR";
  const service = isWebinar
    ? item.webinarService?.mentorService
    : item.oneToOneService?.mentorService;
  const details = isWebinar ? item.webinarService : item.oneToOneService;
  const mentor = service?.user;

  const scheduledAt = isWebinar ? details?.webinarDate : item.scheduledAt;
  const canJoin = item.status === "CONFIRMED" || item.status === "ONGOING";
  const canJoinWebinar =
    item.status === "REGISTERED" && details?.status === "LIVE";
  const canReview = !isWebinar && item.status === "COMPLETED" && !item.review;

  const Row = ({ label, value, accent, mono }) => (
    <div className="flex items-start justify-between px-4 py-3">
      <span className="text-xs text-gray-600 flex-shrink-0">{label}</span>
      <span
        className={`text-xs font-semibold text-right max-w-[60%] break-words
        ${accent ? "text-emerald-400" : mono ? "text-blue-400 font-mono text-[11px]" : "text-gray-300"}`}
      >
        {value}
      </span>
    </div>
  );

  const Section = ({ title, children }) => (
    <div>
      <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2">
        {title}
      </p>
      <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800/70 overflow-hidden">
        {children}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0">
          <div
            className={`relative h-24 overflow-hidden ${!service?.coverImage?.url ? (isWebinar ? "bg-gradient-to-r from-purple-950 to-pink-950" : "bg-gradient-to-r from-blue-950 to-cyan-950") : ""}`}
          >
            {service?.coverImage?.url && (
              <img
                src={service.coverImage.url}
                className="w-full h-full object-cover opacity-40"
                alt=""
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
            >
              ✕
            </button>

            <div className="absolute bottom-3 left-5 flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold text-white
                ${isWebinar ? "bg-purple-600" : "bg-blue-600"}`}
              >
                {isWebinar ? "🎙 Webinar" : "📹 1-to-1"}
              </span>
              <Badge status={item.status} />
            </div>
          </div>

          <div className="px-6 pt-4 pb-3 border-b border-gray-800">
            <h2 className="text-base font-bold text-white leading-tight">
              {service?.title ?? "—"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              with{" "}
              <span className="text-gray-400">
                {mentor?.firstName} {mentor?.lastName}
              </span>
              {mentor?.email && (
                <span className="ml-1 text-gray-600">· {mentor.email}</span>
              )}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Schedule */}
          <Section title="Schedule">
            {scheduledAt && (
              <Row label="📅 Date" value={fmt.date(scheduledAt)} />
            )}
            {scheduledAt && (
              <Row label="🕐 Time" value={fmt.time(scheduledAt)} />
            )}
            <Row
              label="⏱ Duration"
              value={
                isWebinar
                  ? `${details?.webinarDuration} min`
                  : `${item.duration} min`
              }
            />
            {scheduledAt && fmt.timeUntil(scheduledAt) && (
              <Row
                label="⏰ Starts"
                value={fmt.timeUntil(scheduledAt)}
                accent
              />
            )}
          </Section>

          {/* Payment */}
          <Section title="Payment">
            <Row
              label="Amount"
              value={
                isWebinar
                  ? fmt.currency(service?.price ?? 0)
                  : fmt.currency(item.price ?? 0, item.currency)
              }
              accent
            />
            {item.paymentId && (
              <Row label="Payment ID" value={item.paymentId} mono />
            )}
          </Section>

          {/* One-to-one extras */}
          {!isWebinar &&
            item.answers &&
            Object.keys(item.answers).length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2">
                  Your Answers
                </p>
                <div className="space-y-2">
                  {Object.entries(item.answers).map(([q, a], i) => (
                    <div
                      key={i}
                      className="bg-gray-900 rounded-xl border border-gray-800 p-3"
                    >
                      <p className="text-[11px] text-gray-500 mb-1">{q}</p>
                      <p className="text-sm text-gray-300">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Webinar extras */}
          {isWebinar && (
            <Section title="Attendance">
              {item.joinedAt && (
                <Row label="Joined" value={fmt.dateTime(item.joinedAt)} />
              )}
              {item.leftAt && (
                <Row label="Left" value={fmt.dateTime(item.leftAt)} />
              )}
              {item.joinedAt && item.leftAt && (
                <Row
                  label="Watch time"
                  value={`${Math.round((new Date(item.leftAt) - new Date(item.joinedAt)) / 60000)} min`}
                />
              )}
              {!item.joinedAt && (
                <Row label="Attendance" value="Not yet attended" />
              )}
            </Section>
          )}

          {/* Review */}
          {!isWebinar && item.review && (
            <div>
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2">
                Your Review
              </p>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={`text-lg ${s <= item.review.rating ? "text-yellow-400" : "text-gray-700"}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    {item.review.rating}/5
                  </span>
                </div>
                {item.review.comment && (
                  <p className="text-sm text-gray-400 italic">
                    "{item.review.comment}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Booking ID */}
          <Section title="Booking Info">
            <Row
              label="Booking ID"
              value={item.id?.slice(0, 8).toUpperCase()}
              mono
            />
            <Row label="Booked on" value={fmt.date(item.createdAt)} />
          </Section>
        </div>

        {/* Footer actions */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-400 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {canReview && (
              <button
                onClick={() => {
                  onClose();
                  onReview(item);
                }}
                className="px-4 py-2 text-sm font-bold text-yellow-400 bg-yellow-950 border border-yellow-900 hover:bg-yellow-900 rounded-xl transition-colors"
              >
                ★ Write Review
              </button>
            )}

            {(canJoin || canJoinWebinar) && (
              <Link
                href={`/mentor/join-webinar/${item.id}`}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/30"
              >
                Join Now →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Stats Bar ────────────────────────────────────────────
const StatPill = ({ icon, label, value, color }) => (
  <div
    className={`flex items-center gap-3 bg-gray-900 border rounded-2xl px-5 py-4 ${color ?? "border-gray-800"}`}
  >
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="text-xl font-black text-white">{value}</p>
      <p className="text-[11px] text-gray-500 font-medium">{label}</p>
    </div>
  </div>
);

// ─── Filter tabs ──────────────────────────────────────────
const TAB_SESSION_STATUSES = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
];
const TAB_WEBINAR_STATUSES = [
  "ALL",
  "PENDING",
  "REGISTERED",
  "ATTENDED",
  "ABSENT",
];

// ─── Main Page ────────────────────────────────────────────
const LIMIT = 8;

export default function MyBookingsPage() {
  const [tab, setTab] = useState("ONE_TO_ONE");
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [reviewItem, setReviewItem] = useState(null);
  const [search, setSearch] = useState("");
  const [debSearch, setDebSearch] = useState("");
  const [toast, setToast] = useState(null);

  const debRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => {
      setDebSearch(search);
      setPage(1);
    }, 400);
  }, [search]);

  useEffect(() => {
    setPage(1);
    setStatusFilter("ALL");
  }, [tab]);
  useEffect(() => {
    setPage(1);
  }, [statusFilter, debSearch]);

  // ── Fetch items ────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: LIMIT,
          ...(statusFilter !== "ALL" && { status: statusFilter }),
          ...(debSearch && { search: debSearch }),
        };

        const res =
          tab === "ONE_TO_ONE"
            ? await getMyBookings(params)
            : await getMyWebinarRegistrations(params);

        setItems(
          tab === "ONE_TO_ONE"
            ? (res.data.sessions ?? [])
            : (res.data.registrations ?? []),
        );
        setTotal(res.data.total ?? 0);
      } catch {
        showToast("Failed to load bookings.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [tab, page, statusFilter, debSearch]);

  // ── Fetch stats ────────────────────────────────────────
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await studentMentorServicesStats();
        setStats(res.data.stats);
      } catch {}
    };
    fetchStats();
  }, []);

  const totalPages = Math.ceil(total / LIMIT);
  const statuses =
    tab === "ONE_TO_ONE" ? TAB_SESSION_STATUSES : TAB_WEBINAR_STATUSES;

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ── Header ──────────────────────────────────── */}
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            My Bookings
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            All your sessions and webinar registrations
          </p>
        </div>

        {/* ── Stats ────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatPill
            icon="📅"
            label="Total Sessions"
            value={stats?.totalSessions ?? 0}
            color="border-blue-900/50"
          />
          <StatPill
            icon="✅"
            label="Completed"
            value={stats?.completed ?? 0}
            color="border-emerald-900/50"
          />
          <StatPill
            icon="🎙"
            label="Webinars"
            value={stats?.totalWebinars ?? 0}
            color="border-purple-900/50"
          />
          <StatPill
            icon="⭐"
            label="Avg Rating"
            value={stats?.avgRating ?? "—"}
            color="border-yellow-900/50"
          />
        </div>

        {/* ── Main card ────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
          {/* Tabs + search */}
          <div className="px-5 py-4 border-b border-gray-800 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center bg-gray-950 rounded-full p-1 gap-1">
                {[
                  { label: "1-to-1 Sessions", value: "ONE_TO_ONE", icon: "📹" },
                  { label: "Webinars", value: "WEBINAR", icon: "🎙" },
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTab(t.value)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all
                      ${
                        tab === t.value
                          ? "bg-blue-600 text-white shadow"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                  >
                    <span>{t.icon}</span>
                    {t.label}
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
                  placeholder="Search by service..."
                  className="bg-gray-950 border border-gray-800 rounded-full pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
                />
              </div>
            </div>

            {/* Status filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all
                    ${
                      statusFilter === s
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-800 text-gray-600 hover:text-gray-400 hover:border-gray-700"
                    }`}
                >
                  {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="px-5 py-4 space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
            ) : items.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-5xl opacity-10 mb-4">
                  {tab === "WEBINAR" ? "🎙" : "📹"}
                </div>
                <p className="text-sm font-semibold text-gray-500">
                  No bookings found
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  {statusFilter !== "ALL"
                    ? "Try clearing the filter"
                    : "Your bookings will appear here"}
                </p>
                {statusFilter !== "ALL" && (
                  <button
                    onClick={() => setStatusFilter("ALL")}
                    className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm font-semibold rounded-xl transition-colors"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            ) : (
              items.map((item) => (
                <BookingCard
                  key={item.id}
                  item={item}
                  type={tab}
                  onClick={setSelected}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {!loading && total > 0 && (
            <div className="px-5 pb-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-700">
                <span>
                  Showing {Math.min((page - 1) * LIMIT + 1, total)}–
                  {Math.min(page * LIMIT, total)} of {total}
                </span>
                <span>
                  {tab === "ONE_TO_ONE" ? "sessions" : "registrations"}
                </span>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-800 text-gray-500 hover:bg-gray-800 disabled:opacity-30 transition-colors"
                  >
                    ‹
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p =
                      totalPages <= 5
                        ? i + 1
                        : page <= 3
                          ? i + 1
                          : page >= totalPages - 2
                            ? totalPages - 4 + i
                            : page - 2 + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors
                          ${p === page ? "bg-blue-600 text-white" : "border border-gray-800 text-gray-500 hover:bg-gray-800"}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-800 text-gray-500 hover:bg-gray-800 disabled:opacity-30 transition-colors"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ────────────────────────────────── */}
      {selected && (
        <DetailModal
          item={selected}
          type={tab}
          onClose={() => setSelected(null)}
          onReview={(item) => {
            setSelected(null);
            setReviewItem(item);
          }}
        />
      )}

      {/* ── Review Modal ─────────────────────────────────── */}
      {reviewItem && (
        <ReviewModal
          session={reviewItem}
          onClose={() => setReviewItem(null)}
          onSubmitted={() => {
            setReviewItem(null);
            showToast("Review submitted! Thank you.");
            setItems((prev) =>
              prev.map((s) =>
                s.id === reviewItem.id
                  ? { ...s, review: { rating: 5, comment: "" } }
                  : s,
              ),
            );
          }}
        />
      )}

      {/* ── Toast ───────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold border
          ${
            toast.type === "error"
              ? "bg-red-950 border-red-800 text-red-200"
              : "bg-emerald-950 border-emerald-800 text-emerald-200"
          }`}
        >
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
