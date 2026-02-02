"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export default function AdvancePagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let pages = [];

    if (currentPage <= 4) {
      // Start: show first 5, then ..., last 2
      pages = [1, 2, 3, 4, 5, "...", totalPages - 1, totalPages];
    } else if (currentPage >= totalPages - 3) {
      // End: show first 2, ..., last 5
      pages = [
        1,
        2,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      // Middle: first 2, ..., current-1, current, current+1, ..., last 2
      pages = [
        1,
        2,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages - 1,
        totalPages,
      ];
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
      <div className="flex items-center justify-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg  text-g-100 hover:bg-g-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-5 h-5" size={20} />
        </button>

        {/* Page numbers */}
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`min-w-[2.5rem] px-4 py-2 rounded-lg transition ${
              page === currentPage
                ? "bg-g-400 text-white font-medium"
                : page === "..."
                ? "text-gray-500 cursor-default hover:bg-transparent"
                : "bg-gray-200 text-gray-700 cursor-pointer hover:bg-g-400 hover:text-white"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg text-g-100  hover:bg-g-400  disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-5 h-5" size={20} />
        </button>
      </div>
  );
}
