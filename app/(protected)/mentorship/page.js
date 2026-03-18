// pages/student/ServicesPage.jsx
"use client";
import { useState, useEffect, useRef } from "react";
// import { mentorshipApi } from "@/services/mentorshipApi";
// import OneToOneBookingModal from "./OneToOneBookingModal";
// import WebinarBookingModal from "./WebinarBookingModal";
import { getAllServices } from "@/services/mentorApi";
import WebinarBookingModal from "@/components/mentor/WebinarBookingModal";
import OneToOneBookingModal from "@/components/mentor/OneToOneBookingModal";
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
};

// ─── Skeleton ─────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="bg-gray-900 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-44 bg-gray-800" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-800 rounded-lg w-1/3" />
      <div className="h-5 bg-gray-800 rounded-lg w-3/4" />
      <div className="h-3 bg-gray-800 rounded-lg w-full" />
      <div className="h-3 bg-gray-800 rounded-lg w-2/3" />
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-20 bg-gray-800 rounded-full" />
        <div className="h-6 w-16 bg-gray-800 rounded-full" />
      </div>
      <div className="h-10 bg-gray-800 rounded-xl mt-2" />
    </div>
  </div>
);

// ─── Service Card ─────────────────────────────────────────
const ServiceCard = ({ service, onBook }) => {
  const isWebinar = service.type === "WEBINAR";
  const details = isWebinar ? service.webinarDetails : service.oneToOneDetails;
  const mentor = service.user;

  const hasDiscount =
    service.discountedPrice && service.discountedPrice < service.price;

  const displayPrice = hasDiscount ? service.discountedPrice : service.price;

  return (
    <div className="group bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/40 flex flex-col">
      {/* Cover */}
      <div className="relative h-44 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        {service.coverImage?.url ? (
          <img
            src={service.coverImage.url}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt={service.title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
            {isWebinar ? "🎙" : "📹"}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

        {/* Type badge */}
        <div
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold text-white
          ${
            isWebinar
              ? "bg-gradient-to-r from-purple-600 to-pink-600"
              : "bg-gradient-to-r from-blue-600 to-cyan-500"
          }`}
        >
          {isWebinar ? "🎙 Webinar" : "📹 1-to-1"}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-black/70 backdrop-blur-sm rounded-xl px-3 py-1.5">
            {hasDiscount && (
              <span className="text-gray-400 line-through text-[10px] block text-right">
                {fmt.currency(service.price)}
              </span>
            )}
            <span className="text-white font-bold text-sm">
              {fmt.currency(displayPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Mentor */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
            {mentor?.mentorProfile?.profilePicture?.url ? (
              <img
                src={mentor.mentorProfile.profilePicture.url}
                className="w-full h-full object-cover"
              />
            ) : (
              `${mentor?.firstName?.[0] ?? "M"}`
            )}
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {mentor?.firstName} {mentor?.lastName}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-1.5 line-clamp-2 leading-snug">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {service.description}
        </p>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {!isWebinar && details?.callDuration && (
            <span className="px-2.5 py-1 bg-gray-800 text-gray-400 text-[11px] font-semibold rounded-full">
              ⏱ {details.callDuration} min
            </span>
          )}
          {isWebinar && details?.webinarDate && (
            <span className="px-2.5 py-1 bg-purple-950 text-purple-400 text-[11px] font-semibold rounded-full border border-purple-900">
              📅 {fmt.date(details.webinarDate)} ·{" "}
              {fmt.time(details.webinarDate)}
            </span>
          )}
          {isWebinar && details?.webinarDuration && (
            <span className="px-2.5 py-1 bg-gray-800 text-gray-400 text-[11px] font-semibold rounded-full">
              ⏱ {details.webinarDuration} min
            </span>
          )}
          {!isWebinar &&
            details?.skills?.slice(0, 2).map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 bg-blue-950 text-blue-400 text-[11px] font-semibold rounded-full border border-blue-900"
              >
                {s}
              </span>
            ))}
        </div>

        {/* Webinar seats / registrations */}
        {isWebinar && details?._count?.registrations !== undefined && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex -space-x-1">
              {[...Array(Math.min(3, details._count.registrations))].map(
                (_, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border border-gray-900"
                  />
                ),
              )}
            </div>
            <span className="text-[11px] text-gray-500">
              {details._count.registrations} registered
            </span>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => onBook(service)}
          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 
            ${
              isWebinar
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/30"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-900/30"
            }`}
        >
          {isWebinar ? "Register Now" : "Book Session"}
        </button>
      </div>
    </div>
  );
};

// ─── Filter Toggle ────────────────────────────────────────
const FilterBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150
      ${
        active
          ? "bg-white text-gray-950 border-white"
          : "border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300"
      }`}
  >
    {children}
  </button>
);

// ─── Main Page ────────────────────────────────────────────
const LIMIT = 12;

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [bookingService, setBookingService] = useState(null);
  const [toast, setToast] = useState(null);

  const debounceRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [typeFilter]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getAllServices({
          page,
          limit: LIMIT,
          ...(typeFilter !== "ALL" && { type: typeFilter }),
          ...(debouncedSearch && { search: debouncedSearch }),
        });
        setServices(res.data.services ?? []);
        setTotal(res.data.total ?? 0);
      } catch {
        showToast("Failed to load services.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [typeFilter, debouncedSearch, page]);

  const handleBookingSuccess = (msg) => {
    setBookingService(null);
    showToast(msg);
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-start justify-between w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight">
              Find a Mentor
            </h1>
            <p className="text-gray-500 mt-1.5 text-sm">
              Book 1-to-1 sessions or join live webinars with expert mentors
            </p>
          </div>
          <Link
            href={"/mentorship/my-bookings"}
            className="py-4 px-5 w-fit text-sm leading-5 rounded-lg border border-primary bg-primary text-white text-left min-h-[48px] flex items-center justify-between cursor-pointer"
          >
            My Bookings
          </Link>
        </div>

        {/* ── Filters ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          {/* Type filter */}
          <div className="flex items-center gap-2">
            <FilterBtn
              active={typeFilter === "ALL"}
              onClick={() => setTypeFilter("ALL")}
            >
              All
            </FilterBtn>
            <FilterBtn
              active={typeFilter === "ONE_TO_ONE"}
              onClick={() => setTypeFilter("ONE_TO_ONE")}
            >
              📹 1-to-1
            </FilterBtn>
            <FilterBtn
              active={typeFilter === "WEBINAR"}
              onClick={() => setTypeFilter("WEBINAR")}
            >
              🎙 Webinar
            </FilterBtn>
          </div>

          {/* Search */}
          <div className="relative ml-auto">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
              🔍
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="bg-gray-900 border border-gray-800 rounded-full pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
          </div>
        </div>

        {/* ── Grid ────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="py-28 text-center">
            <div className="text-5xl mb-4 opacity-20">🔍</div>
            <p className="text-gray-500 font-semibold">No services found</p>
            <p className="text-gray-700 text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={setBookingService}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ──────────────────────────────── */}
        {!loading && total > LIMIT && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-800 text-gray-500 hover:bg-gray-800 disabled:opacity-30"
            >
              ‹
            </button>
            {Array.from(
              { length: Math.ceil(total / LIMIT) },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors
                  ${p === page ? "bg-blue-600 text-white" : "border border-gray-800 text-gray-500 hover:bg-gray-800"}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === Math.ceil(total / LIMIT)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-800 text-gray-500 hover:bg-gray-800 disabled:opacity-30"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* ── Booking Modals ────────────────────────────── */}
      {bookingService?.type === "ONE_TO_ONE" && (
        <OneToOneBookingModal
          service={bookingService}
          onClose={() => setBookingService(null)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {bookingService?.type === "WEBINAR" && (
        <WebinarBookingModal
          service={bookingService}
          onClose={() => setBookingService(null)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* ── Toast ────────────────────────────────────── */}
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
