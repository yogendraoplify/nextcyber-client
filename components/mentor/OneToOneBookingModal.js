// pages/student/OneToOneBookingModal.jsx
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  bookSession,
  getAvailableSlots,
  mentorshipApi,
} from "@/services/mentorApi";
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
};

// ─── Step indicator ───────────────────────────────────────
const Steps = ({ current }) => {
  const steps = ["Pick Date", "Choose Slot", "Your Info", "Payment"];
  return (
    <div className="flex items-center gap-0 mb-6">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${
                i < current
                  ? "bg-blue-600 text-white"
                  : i === current
                    ? "bg-blue-600 text-white ring-4 ring-blue-600/20"
                    : "bg-gray-800 text-gray-600"
              }`}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span
              className={`text-[10px] font-medium hidden sm:block
              ${i === current ? "text-blue-400" : i < current ? "text-gray-400" : "text-gray-700"}`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-2 ${i < current ? "bg-blue-600" : "bg-gray-800"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Calendar ─────────────────────────────────────────────
const Calendar = ({ selectedDate, onSelect }) => {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const toStr = (d) => {
    const dd = new Date(d);
    return `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, "0")}-${String(dd.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
      {/* Nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 transition-colors"
        >
          ‹
        </button>
        <span className="text-sm font-bold text-white">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 transition-colors"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-bold text-gray-600 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = new Date(year, month, i + 1);
          const dateStr = toStr(date);
          const isPast = date < today;
          const isToday = toStr(date) === toStr(today);
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => onSelect(dateStr)}
              className={`aspect-square flex items-center justify-center rounded-xl text-xs font-semibold transition-all
                ${
                  isPast
                    ? "text-gray-800 cursor-not-allowed"
                    : isSelected
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                      : isToday
                        ? "bg-gray-800 text-blue-400 border border-blue-800"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Stripe Payment Form ──────────────────────────────────
const PaymentForm = ({ onSuccess, onBack, loading, setLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

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

    if (paymentIntent?.status === "succeeded") {
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-gray-700 text-gray-400 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handlePay}
          disabled={loading || !stripe}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </button>
      </div>
    </div>
  );
};

// ─── Main Modal ───────────────────────────────────────────
export default function OneToOneBookingModal({ service, onClose, onSuccess }) {
  const details = service.oneToOneDetails;

  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const displayPrice =
    service.discountedPrice && service.discountedPrice < service.price
      ? service.discountedPrice
      : service.price;

  // Fetch slots when date is selected
  useEffect(() => {
    if (!selectedDate || !details?.id) return;

    console.log("control reaching here!");
    const fetch = async () => {
      setSlotsLoading(true);
      setSlots([]);
      setSelectedSlot(null);
      try {
        const res = await getAvailableSlots(details.id, selectedDate);
        setSlots(res.data.slots ?? []);
      } catch {
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetch();
  }, [selectedDate, details?.id]);

  // Step 0 → 1: date selected, move to slot step
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStep(1);
  };

  // Step 1 → 2: slot selected, move to questions
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(2);
  };

  // Step 2 → 3: submit answers, create booking + payment intent
  const onAnswersSubmit = async (data) => {
    setBookingLoading(true);
    try {
      const answers = {};
      (details?.questions ?? []).forEach((q, i) => {
        answers[q] = data[`q_${i}`];
      });

      const res = await bookSession({
        oneToOneServiceId: details.id,
        date: selectedDate,
        availabilitySlotId: selectedSlot.availabilitySlotId,
        answers: Object.keys(answers).length > 0 ? answers : null,
      });

      setClientSecret(res.data.clientSecret);
      setStep(3);
    } catch (e) {
      alert(e.response?.data?.message ?? "Failed to create booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    onSuccess(
      "Session booked successfully! Check your email for confirmation.",
    );
  };

  // const toAmPm = (iso) => {
  //   const d = new Date(iso);
  //   return d.toLocaleTimeString("en-IN", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  // };

  const toAmPm = (iso) => {
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  const toStudentLocalTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      // ✅ No timezone specified = browser uses student's local timezone automatically
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">Book Session</h2>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">
              {service.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <Steps current={step} />

          {/* ── STEP 0: Pick date ──────────────────── */}
          {step === 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-4">
                Select a date to see available slots
              </p>
              <Calendar
                selectedDate={selectedDate}
                onSelect={handleDateSelect}
              />
            </div>
          )}

          {/* ── STEP 1: Choose slot ────────────────── */}
          {step === 1 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-300">
                  Available slots for{" "}
                  <span className="text-white">
                    {new Date(selectedDate).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </p>
                <button
                  onClick={() => setStep(0)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Change date
                </button>
              </div>

              {slotsLoading ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-10 w-32 bg-gray-800 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="text-3xl mb-3 opacity-30">📅</div>
                  <p className="text-sm text-gray-500 font-semibold">
                    No slots available
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    Try a different date
                  </p>
                  <button
                    onClick={() => setStep(0)}
                    className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Pick another date
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => handleSlotSelect(slot)}
                      className="px-4 py-2.5 bg-gray-900 border border-gray-700 hover:border-blue-500 hover:bg-blue-950 text-sm font-semibold text-gray-300 hover:text-blue-300 rounded-xl transition-all"
                    >
                      {/* {toAmPm(slot.startTime)} – {toAmPm(slot.endTime)} */}
                      {toStudentLocalTime(slot.startTime)} –{" "}
                      {toStudentLocalTime(slot.endTime)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Questions ──────────────────── */}
          {step === 2 && (
            <form
              onSubmit={handleSubmit(onAnswersSubmit)}
              className="space-y-5"
            >
              {/* Booking summary */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Date</span>
                  <span className="text-gray-300 font-semibold">
                    {new Date(selectedDate).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Time</span>
                  <span className="text-gray-300 font-semibold">
                    {toStudentLocalTime(selectedSlot.startTime)} –{" "}
                    {toStudentLocalTime(selectedSlot.endTime)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Duration</span>
                  <span className="text-gray-300 font-semibold">
                    {details?.callDuration} min
                  </span>
                </div>
                <div className="h-px bg-gray-800 my-1" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-semibold">Total</span>
                  <span className="text-white font-bold">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(displayPrice)}
                  </span>
                </div>
              </div>

              {/* Questions */}
              {(details?.questions ?? []).length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-300">
                    A few questions from the mentor
                  </p>
                  {details.questions.map((q, i) => (
                    <div key={i}>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                        {q} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register(`q_${i}`, {
                          required: "This field is required.",
                        })}
                        rows={3}
                        placeholder="Your answer..."
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      {errors[`q_${i}`] && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors[`q_${i}`].message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 text-center py-4">
                  No questions required. Click proceed to continue.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-700 text-gray-400 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  {bookingLoading
                    ? "Creating booking..."
                    : "Proceed to Payment"}
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3: Payment ────────────────────── */}
          {step === 3 && clientSecret && (
            <div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-5">
                <p className="text-xs text-gray-500 mb-1">Amount to pay</p>
                <p className="text-2xl font-black text-white">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(displayPrice)}
                </p>
              </div>

              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "night",
                    variables: {
                      colorPrimary: "#3b82f6",
                      colorBackground: "#111827",
                      borderRadius: "12px",
                    },
                  },
                }}
              >
                <PaymentForm
                  onSuccess={handlePaymentSuccess}
                  onBack={() => setStep(2)}
                  loading={payLoading}
                  setLoading={setPayLoading}
                />
              </Elements>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
