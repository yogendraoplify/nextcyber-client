"use client";
import { useState, useEffect, useRef } from "react";
import CreateServiceModal from "@/components/mentor/CreateServiceModal";
import {
  createOneToOneService,
  createWebinarService,
  getMentorServices,
  getServicesStats,
  toggleMentorServiceStatus,
} from "@/services/mentorApi";
import ViewServiceModal from "@/components/mentor/ViewServiceModal";
import Link from "next/link";

// ─── Stat Card ────────────────────────────────────────────
const StatCard = ({ icon, bg, label, value, unit }) => (
  <div className="flex-1 flex items-center gap-4 px-6 py-5">
    <div
      className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center text-xl flex-shrink-0`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-white">
        {value}
        {unit && (
          <span className="text-sm font-medium text-gray-400 ml-1">{unit}</span>
        )}
      </p>
    </div>
  </div>
);

// ─── Service Type Badge ───────────────────────────────────
const TypeBadge = ({ type }) => {
  const isWebinar = type === "WEBINAR";
  return (
    <div
      className={`absolute top-0 left-0 px-2 py-0.5 text-[10px] font-bold rounded-br-xl rounded-tl-xl
      ${
        isWebinar
          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
      }`}
    >
      {isWebinar ? "Webinar" : "1:1 call"}
    </div>
  );
};

// ─── Three-dot Menu ───────────────────────────────────────
const ActionMenu = ({ service, onToggle, onEdit }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors text-lg"
      >
        ⋮
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-30 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl py-1.5 w-44 overflow-hidden">
          <button
            onClick={() => {
              onEdit(service);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors flex items-center gap-2.5"
          >
            <span className="text-base">✏️</span> Edit
          </button>
          <button
            onClick={() => {
              onToggle(service);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors flex items-center gap-2.5"
          >
            <span className="text-base">{service.isActive ? "⏸️" : "▶️"}</span>
            {service.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Service Card ─────────────────────────────────────────
const ServiceCard = ({ service, onEdit, onToggle, setViewService }) => {
  const isWebinar = service.type === "WEBINAR";
  const details = isWebinar ? service.webinarDetails : service.oneToOneDetails;

  const meta = isWebinar
    ? `📅 ${new Date(details?.webinarDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}   ₹${service.price} Price`
    : `⏱ ${details?.callDuration} Min Duration   ₹${service.price} Price`;

  return (
    <div
      className={`flex items-center gap-4 border rounded-2xl px-5 py-4 transition-all hover:shadow-lg
      ${service.isActive ? "border-gray-700 bg-gray-800" : "border-gray-700 bg-gray-800/50 opacity-60"}`}
    >
      {/* Thumbnail */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-700 flex-shrink-0">
        {service.coverImage?.url ? (
          <img
            src={service.coverImage.url}
            className="w-full h-full object-cover"
            alt={service.title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            {isWebinar ? "🎙" : "📹"}
          </div>
        )}
        <TypeBadge type={service.type} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white truncate">
            {service.title}
          </h3>
          {!service.isActive && (
            <span className="text-[10px] font-semibold text-orange-400 bg-orange-950 border border-orange-800 px-2 py-0.5 rounded-full flex-shrink-0">
              Inactive
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
          {service.description}
        </p>
        <p className="text-xs text-gray-500 mt-1">{meta}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <ActionMenu service={service} onToggle={onToggle} onEdit={onEdit} />
        <button onClick={() => setViewService(service)} className="...">
          👁
        </button>
        {isWebinar ? (
          service.webinarDetails.status === "UPCOMING" ? (
            <Link
              href={`/mentor/start-webinar/${service.webinarDetails.id}`}
              className="text-xs"
            >
              Start Webinar
            </Link>
          ) : (
            <span className="text-xs">{service.webinarDetails.status}</span>
          )
        ) : service.oneToOneDetails.status === "CONFIRMED" ? (
          <Link
            href={`/mentor/join-session/${service.oneToOneDetails.id}`}
            className="text-xs"
          >
            Start Session
          </Link>
        ) : (
          <span className="text-xs">{service.oneToOneDetails.status}</span>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-12 bg-gray-700 flex-shrink-0 mx-2" />

      {/* Stats */}
      <div className="flex items-center gap-6 flex-shrink-0">
        {[
          { label: "Views", value: service.stats?.views ?? 0 },
          { label: "Bookings", value: service.stats?.bookings ?? 0 },
          { label: "Earnings", value: service.stats?.earnings ?? 0 },
          {
            label: "Conversion Rate",
            value: `${service.stats?.conversion ?? 0}%`,
          },
        ].map((s) => (
          <div key={s.label} className="text-center min-w-[60px]">
            <p className="text-base font-bold text-white">{s.value}</p>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5 whitespace-nowrap">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────
const Pagination = ({ page, total, limit, onChange }) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
      >
        ‹
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors
            ${
              p === page
                ? "bg-blue-600 text-white border border-blue-600"
                : "border border-gray-700 text-gray-400 hover:bg-gray-700"
            }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
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
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white
      ${toast.type === "error" ? "bg-red-600" : "bg-emerald-600"}`}
    >
      <span>{toast.type === "error" ? "✕" : "✓"}</span>
      {toast.msg}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────
const LIMIT = 10;

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("ONE_TO_ONE");
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [toast, setToast] = useState(null);
  const [viewService, setViewService] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch services ────────────────────────────────────
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await getMentorServices();
      const all = res.data.services ?? [];

      const filtered = all.filter((s) => s.type === activeTab);
      setTotal(filtered.length);
      setServices(filtered.slice((page - 1) * LIMIT, page * LIMIT));
    } catch {
      showToast("Failed to load services.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchServicesStats = async () => {
    setLoading(true);
    try {
      const res = await getServicesStats();
      const all = res.data.stats ?? [];
      setStats(all);
    } catch {
      showToast("Failed to load services stats.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchServicesStats();
  }, [activeTab, page]);

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  // ── Handlers ─────────────────────────────────────────
  const handleToggle = async (service) => {
    try {
      await toggleMentorServiceStatus(service.id);
      showToast(`Service ${service.isActive ? "deactivated" : "activated"}.`);
      fetchServices();
    } catch {
      showToast("Failed to update service.", "error");
    }
  };

  const handleCreateSubmit = async (formData) => {
    const type = formData.get("type");
    try {
      if (type === "WEBINAR") {
        await createWebinarService(formData);
      } else {
        await createOneToOneService(formData);
      }
      showToast("Service created successfully!");
      setShowModal(false);
      setEditService(null);
      fetchServices();
    } catch (e) {
      showToast(
        e.response?.data?.message ?? "Failed to create service.",
        "error",
      );
      throw e;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="w-full space-y-5">
        {/* ── Page Header ─────────────────────────────── */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Services</h1>
          <button
            onClick={() => {
              setEditService(null);
              setShowModal(true);
            }}
            className="py-4 px-5 w-fit text-sm leading-5 rounded-lg border border-primary bg-primary text-white text-left min-h-[48px] flex items-center justify-between cursor-pointer"
          >
            Add New Service
          </button>
        </div>

        {/* ── Stats Row ────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl flex divide-x divide-gray-800 overflow-hidden shadow-lg">
          <StatCard
            icon="📅"
            bg="bg-purple-900"
            label="Total Sessions"
            value={stats?.totalSessions ?? 0}
          />
          <StatCard
            icon="⏰"
            bg="bg-blue-900"
            label="Total Duration"
            value={stats?.totalDuration ?? 0}
            unit="Mins"
          />
          <StatCard
            icon="💬"
            bg="bg-pink-900"
            label="Total Reviews"
            value={stats?.totalReviews ?? 0}
          />
          <StatCard
            icon="⭐"
            bg="bg-yellow-900"
            label="Avg Ratings"
            value={stats?.avgRating ?? 0}
          />
        </div>

        {/* ── Your Services Section ─────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg">
          {/* Section header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h2 className="text-base font-bold text-white">Your Services</h2>

            {/* Tab toggle */}
            <div className="flex items-center bg-gray-800 rounded-full p-1 gap-1">
              {[
                { label: "1-to-1", value: "ONE_TO_ONE" },
                { label: "Webinar", value: "WEBINAR" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200
                    ${
                      activeTab === tab.value
                        ? "bg-gray-700 text-blue-400 shadow-sm"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service list */}
          <div className="px-6 py-4 space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-800 rounded-2xl animate-pulse"
                />
              ))
            ) : services.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-4xl mb-3">
                  {activeTab === "WEBINAR" ? "🎙" : "📹"}
                </div>
                <p className="text-sm font-semibold text-gray-400">
                  No {activeTab === "WEBINAR" ? "webinar" : "1-to-1"} services
                  yet
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Click "Add New Service" to create one
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-colors"
                >
                  + Add Service
                </button>
              </div>
            ) : (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={(s) => {
                    setEditService(s);
                    setShowModal(true);
                  }}
                  onToggle={handleToggle}
                  setViewService={setViewService}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && total > LIMIT && (
            <div className="px-6 pb-5">
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

      {/* ── Modal ─────────────────────────────────────────── */}
      {showModal && (
        <CreateServiceModal
          onClose={() => {
            setShowModal(false);
            setEditService(null);
          }}
          onSubmit={handleCreateSubmit}
          editData={editService}
        />
      )}

      {viewService && (
        <ViewServiceModal
          service={viewService}
          onClose={() => setViewService(null)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
