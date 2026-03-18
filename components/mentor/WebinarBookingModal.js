// pages/student/WebinarBookingModal.jsx
"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { mentorshipApi, registerWebinar } from "@/services/mentorApi";
// import { mentorshipApi } from "@/services/mentorshipApi";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const fmt = {
  currency: (n, c = "INR") =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: c,
      maximumFractionDigits: 0,
    }).format(n),
  dateTime: (d) =>
    new Date(d).toLocaleString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
};

// ─── Stripe Form ──────────────────────────────────────────
const WebinarPaymentForm = ({ onSuccess, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/success`,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") onSuccess();
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-gray-700 text-gray-400 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handlePay}
          disabled={loading || !stripe}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all"
        >
          {loading ? "Processing..." : "Confirm Registration"}
        </button>
      </div>
    </div>
  );
};

// ─── Main Modal ───────────────────────────────────────────
export default function WebinarBookingModal({ service, onClose, onSuccess }) {
  const details = service.webinarDetails;
  const isFree = service.price === 0;

  const [step, setStep] = useState("details"); // details | payment | success
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  const displayPrice =
    service.discountedPrice && service.discountedPrice < service.price
      ? service.discountedPrice
      : service.price;

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await registerWebinar(details.id);

      if (isFree || !res.data.clientSecret) {
        // Free webinar — directly show success
        onSuccess("You're registered! Check your email for details.");
        return;
      }

      // Paid — go to payment
      setClientSecret(res.data.clientSecret);
      setStep("payment");
    } catch (e) {
      alert(e.response?.data?.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    onSuccess("Registration confirmed! Check your email for details.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative h-32 overflow-hidden">
          {service.coverImage?.url ? (
            <img
              src={service.coverImage.url}
              className="w-full h-full object-cover"
              alt={service.title}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center text-5xl opacity-40">
              🎙
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-3 left-5">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600">
              🎙 Webinar
            </span>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* ── STEP: Details ─────────────────────── */}
          {step === "details" && (
            <>
              <div>
                <h2 className="text-lg font-black text-white leading-tight">
                  {service.title}
                </h2>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>

              {/* Details grid */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-gray-500">📅 Date & Time</span>
                  <span className="text-xs font-semibold text-gray-300 text-right max-w-[55%]">
                    {details?.webinarDate
                      ? fmt.dateTime(details.webinarDate)
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-gray-500">⏱ Duration</span>
                  <span className="text-xs font-semibold text-gray-300">
                    {details?.webinarDuration} min
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-gray-500">👥 Registered</span>
                  <span className="text-xs font-semibold text-gray-300">
                    {details?._count?.registrations ?? 0} students
                  </span>
                </div>
                {details?.instructions &&
                  details.instructions !== "<p><br></p>" && (
                    <div className="px-4 py-3">
                      <p className="text-xs text-gray-500 mb-1.5">
                        📋 Instructions
                      </p>
                      <div
                        className="text-xs text-gray-400 leading-relaxed line-clamp-3 prose prose-sm prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: details.instructions,
                        }}
                      />
                    </div>
                  )}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between px-1">
                <div>
                  {isFree ? (
                    <span className="text-2xl font-black text-emerald-400">
                      Free
                    </span>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">
                        {fmt.currency(displayPrice)}
                      </span>
                      {service.discountedPrice &&
                        service.discountedPrice < service.price && (
                          <span className="text-sm text-gray-600 line-through">
                            {fmt.currency(service.price)}
                          </span>
                        )}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-purple-900/30"
                >
                  {loading
                    ? "Please wait..."
                    : isFree
                      ? "Register Free"
                      : "Register Now →"}
                </button>
              </div>
            </>
          )}

          {/* ── STEP: Payment ─────────────────────── */}
          {step === "payment" && clientSecret && (
            <div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-5">
                <p className="text-xs text-gray-500 mb-1">Registration fee</p>
                <p className="text-2xl font-black text-white">
                  {fmt.currency(displayPrice)}
                </p>
                <p className="text-xs text-gray-600 mt-1">{service.title}</p>
              </div>

              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "night",
                    variables: {
                      colorPrimary: "#a855f7",
                      colorBackground: "#111827",
                      borderRadius: "12px",
                    },
                  },
                }}
              >
                <WebinarPaymentForm
                  onSuccess={handlePaymentSuccess}
                  onBack={() => setStep("details")}
                />
              </Elements>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
