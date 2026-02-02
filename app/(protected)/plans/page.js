"use client";
import Retry from "@/components/ui/Retry";
import {
  asyncGetCompanyPlans,
  asyncGetStudentPlans,
} from "@/store/actions/planAction";
import { buySubscriptionAPIHandler } from "@/store/actions/subscriptionAction";
import {
  Infinity,
  Rocket,
  Atom,
  CheckCircle2,
  Minus,
  Plus,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Pricing() {
  const [openItems, setOpenItems] = useState(new Set([]));
  const { user } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { plans } = useSelector((state) => state.plans);

  const [billingType, setBillingType] = useState("MONTHLY");
  const retryHandler = () => {
    setError(null);

    if (user.role === "STUDENT") {
      dispatch(asyncGetStudentPlans(setError));
    } else {
      dispatch(asyncGetCompanyPlans(setError));
    }
  };

  useEffect(() => {
    if (!user) return;
    if (plans.length > 0) return;

    if (user.role === "STUDENT") {
      dispatch(asyncGetStudentPlans(setError));
    } else {
      dispatch(asyncGetCompanyPlans(setError));
    }
  }, [user, plans.length, dispatch]);

  const faqItems = [
    {
      id: 0,
      question: "Do I need Pro to apply for jobs?",
      answer:
        "No, you don’t need Pro to apply for jobs. However, Pro may unlock additional features that can help you stand out to employers.",
    },
    {
      id: 1,
      question: "Can I cancel anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. Once canceled, you’ll retain access until the end of your billing cycle.",
    },
    {
      id: 2,
      question: "Is there a student discount?",
      answer:
        "Yes, we offer student discounts. You’ll need to verify your student status to claim the discount.",
    },
    {
      id: 3,
      question: "What’s included in the interview prep kit?",
      answer:
        "The interview prep kit includes practice questions, mock interview guidance, and curated resources to help you prepare effectively.",
    },
    {
      id: 4,
      question: "How does mentor pricing work?",
      answer:
        "Mentor pricing depends on the mentor’s experience and session length. Rates are clearly displayed before booking.",
    },
    {
      id: 5,
      question: "Do you offer campus or cohort pricing?",
      answer:
        "Yes, we provide special pricing for campuses and cohorts. Please reach out to our support team for customized packages.",
    },
  ];

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  if (error) {
    return (
      <Retry
        error={"Something went wrong. Please try again."}
        onRetry={retryHandler}
      />
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="h-[calc(100vh-100.67px)] flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const filteredPlans = plans.filter(
    (p) => p.billingCycle === billingType || p.price === 0
  );

  const buySubscriptionHandler = (payload) => {
    dispatch(buySubscriptionAPIHandler(payload, setLoading));
  };

  return (
    <section className="bg-g-900">
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-5xl font-semibold leading-14 pt-5">
          We’ve got a pricing plan that’s perfect for you
        </h2>
        <p className="text-g-200 leading-6 text-base mt-11">
          Choose the perfect plan for your business needs
        </p>
        <p className="text-accent-color-1 leading-6 font-medium mt-6">
          Save 15% on yearly plan!
        </p>

        <div className="inline-flex mt-2.5 rounded-full bg-g-700 p-2 space-x-2 border border-g-500">
          <button
            onClick={() => setBillingType("MONTHLY")}
            className={`px-4 py-2 text-xs leading-4 font-semibold rounded-full cursor-pointer ${
              billingType === "MONTHLY"
                ? "bg-g-500 text-g-200"
                : "bg-g-700 text-g-200"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setBillingType("YEARLY")}
            className={`px-4 py-2 text-xs leading-4 font-semibold rounded-full cursor-pointer ${
              billingType === "YEARLY"
                ? "bg-g-500 text-g-200"
                : "bg-g-700 text-g-200"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-5xl mx-auto mt-5">
        {filteredPlans.map((plan, index) => {
          const currentSubs =
            user?.subscription &&
            user?.subscription.type ===
              plan.name.split(" ").join("_").toUpperCase() &&
            user?.subscription.billingCycle === plan.billingCycle;
          return (
            <div key={plan.id}>
              <div className=" border border-g-500 rounded-[20px] p-5">
                <div className="mb-5 flex items-center justify-between">
                  {plan.name == "Basic" ? (
                    <Atom size={32} className=" text-light-yellow" />
                  ) : plan.name == "Pro" ? (
                    <Rocket size={32} className=" text-light-green" />
                  ) : (
                    <Infinity size={32} className=" text-light-blue" />
                  )}
                  {plan.tag && (
                    <span className=" bg-g-600 border border-g-500 text-g-200 text-xs leading-4 font-medium px-2 py-1 rounded-full">
                      {plan.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-base text-g-100 leading-6 font-semibold">
                  {plan.name}
                </h3>
                <p className="text-g-200 text-sm mt-2 leading-4 max-w-4/5">
                  {plan.description}
                </p>

                <div className="mt-7.5">
                  <span className="text-4xl font-semibold leading-11 tracking-[-1%] text-g-100">
                    {plan.price == 0 ? "Free" : plan.price}
                  </span>
                  <span className="text-g-200 text-xs leading-4 font-medium ml-2">
                    {plan.price !== 0
                      ? `/${plan.billingCycle === "MONTHLY" ? "month" : "year"}`
                      : ""}
                  </span>
                </div>

                <button
                  className={`w-full mt-10 bg-g-600 text-g-200 hover:text-white transition-colors hover:bg-gradient-to-b hover:from-accent-color-1 hover:to-primary leading-4 text-sm py-2 px-4 font-medium rounded-full border border-g-500 ${
                    index === 0 || currentSubs
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } ${
                    currentSubs &&
                    "bg-gradient-to-b from-accent-color-1 to-primary text-white"
                  }`}
                  disabled={index === 0 ? true : false || currentSubs}
                  onClick={() => {
                    const payload = {
                      plan: plan.name.split(" ").join("_").toUpperCase(),
                      billingCycle: plan.billingCycle,
                    };
                    buySubscriptionHandler(payload);
                  }}
                >
                  {currentSubs ? "Currently Active" : plan.ctaText}
                </button>
              </div>

              <ul className="mt-10 space-y-2 px-5 text-g-200 text-xs leading-4 font-medium">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-dark-blue" />{" "}
                    {feature.text}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className=" py-25">
        <div className=" max-w-[1440px] mx-auto px-5 sm:px-10">
          <h2 className="text-g-100 text-4xl leading-11 text-center font-semibold tracking-[-1%] mb-10">
            Frequently Asked Questions
          </h2>

          <div className="flex flex-col gap-2.5 mx-auto max-w-3xl">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="border-b border-g-600 bg-[#FFFFFF0D] rounded-lg flex flex-col gap-6 overflow-hidden py-4 px-5"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left flex items-start justify-between gap-2.5 cursor-pointer"
                >
                  <span className="text-g-200 font-medium text-base leading-6">
                    {item.question}
                  </span>

                  <div className="btn-gradient overflow-hidden shrink-0">
                    <div className=" p-2.5 bg-g-600 rounded-[calc(100%-2px)] whitespace-nowrap text-g-200 cursor-pointer">
                      {openItems.has(item.id) ? (
                        <Minus size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                    </div>
                  </div>
                </button>

                {openItems.has(item.id) && (
                  <div>
                    <p className="text-g-200 text-base leading-[150%]">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
