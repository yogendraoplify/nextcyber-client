"use client";
import { X, XCircle } from "lucide-react";
import React, { useEffect } from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed backdrop-blur-[2px] inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className={`bg-g-700 rounded-lg z-10 p-7.5 w-[636px] border border-g-400 shadow-lg`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-xl leading-6 font-semibold text-g-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-g-200 cursor-pointer hover:text-g-100 transition-colorsI"
          >
            <XCircle size={20} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
