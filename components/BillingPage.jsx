"use client";
import Pagination from "./Pagination";
import Search from "./ui/Search";
import Filter from "./ui/Filter";
import Table from "./ui/Table";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/errMessage";

import { subscriptionsList, subscriptionDetails } from "@/api/subscriptionApi";
import Link from "next/link";

export default function BillingPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [invoices, setInvoices] = useState([]);
  const [subscription, setSubscription] = useState(null);

  async function getSubscriptionDetails() {
    try {
      const { data } = await subscriptionDetails();
      setSubscription(data.data);
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Failed to fetch subscription details.")
      );
    }
  }

  async function getInvoices() {
    try {
      const { data } = await subscriptionsList({
        search: search || "",
        status: status || "",
        page,
        limit: pageSize,
      });

      setInvoices(data.data.invoices || []);
      setTotalPages(data.data.totalPages || 1);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to fetch invoice list."));
    }
  }

  useEffect(() => {
    getSubscriptionDetails();
  }, []);

  useEffect(() => {
    getInvoices();
  }, [page, status, pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      getInvoices();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const columns = [
    {
      label: "Invoice",
      key: "invoiceNumber",
      render: (row) => <span className="text-g-200">{row.invoiceNumber}</span>,
    },
    {
      label: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium text-basewhite capitalize
        ${row.status === "UPCOMING" ? "bg-dark-yellow" : "bg-dark-green"}`}
        >
          {row.status.toLowerCase()}
        </span>
      ),
    },
    {
      label: "Date",
      key: "createdAt",
      render: (row) => (
        <span className="text-g-300">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      label: "Amount",
      key: "amountPaid",
      render: (row) => (
        <span className="text-g-300">
          {row.currency} {(row.amountPaid / 100).toFixed(2)}
        </span>
      ),
    },
    {
      label: "Action",
      key: "action",
      render: (row) =>
        row.status === "UPCOMING" ? (
          <span className="px-3 py-1 rounded bg-bg text-xs text-g-300">
            None
          </span>
        ) : (
          <a
            href={row.pdfUrl}
            target="_blank"
            className="flex items-center gap-2 px-3 py-1 w-fit rounded bg-primary-2-light text-primary-2 text-xs font-medium"
          >
            Download
          </a>
        ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-primary bg-g-600">
          <div className="flex items-center justify-between px-5 py-4 border-b border-g-700">
            <div className="flex items-center gap-3">
              <h3 className="text-g-100 text-base font-medium">
                {subscription?.type || "Pro Plan"}
              </h3>
              <span className="px-2 py-1 text-xs font-medium rounded bg-dark-green text-basewhite">
                {subscription?.billingCycle || "MONTHLY"}
              </span>
            </div>

            <Link
              href={"/plans"}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-2 text-white text-xs font-medium"
            >
              Change Plan <ArrowRight size={20} />
            </Link>
          </div>

          <div className="flex gap-5 p-5">
            <div className="flex-1 p-4 rounded-lg bg-g-700 border border-g-500">
              <p className="text-g-100 text-base font-medium">
                ${subscription?.amount}
              </p>
              <p className="text-sm text-g-200">Next Bill Amount</p>
            </div>

            <div className="flex-1 p-4 rounded-lg bg-g-700 border border-g-500">
              <p className="text-g-100 text-base font-medium">Coming Soon</p>
              <p className="text-sm text-g-200">Next Bill Date</p>
            </div>
          </div>
        </div>

        <div className="rounded-primary bg-g-600">
          <div className="px-5 py-4 border-b border-g-700">
            <h3 className="text-g-100 text-base font-medium">
              Billing Details
            </h3>
          </div>

          <div className="flex gap-6 p-5 text-sm">
            <div className="space-y-4 text-g-100 font-medium">
              <p>Name</p>
              <p>Address</p>
              <p>Contact</p>
            </div>

            <div className="space-y-4 text-g-200">
              <p>{`${subscription?.user?.firstName} ${subscription?.user?.lastName}`}</p>
              <p>Keizersgracht 136, 1015 CW Amsterdam, Netherlands</p>
              <p>Jason Tatum</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-g-500 overflow-hidden">
        <div className="flex justify-between items-center p-5 bg-g-600">
          <Search
            placeholder="Search invoice..."
            value={search}
            setValue={(val) => {
              setPage(1);
              setSearch(val);
            }}
          />

          <Filter
            placeholder="Status"
            options={[
              { label: "Paid", value: "PAID" },
              { label: "Upcoming", value: "UPCOMING" },
            ]}
            onChange={(value) => {
              setPage(1);
              setStatus(value || "");
            }}
          />
        </div>

        <Table columns={columns} data={invoices} />

        <Pagination
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
