import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Pagination({
  page,
  setPage,
  pageSize,
  setPageSize,
  totalPages,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const options = [10, 20, 30];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center px-5 py-3 bg-g-700 border-t border-g-500">
        <div className="flex items-center gap-1.5">
          <span className="text-[#9C9C9D]">Rows per page</span>
          <div ref={ref} className="rounded-md border border-[#2F3031] w-12.5">
            <button
              type="button"
              onClick={() => setOpen((p) => !p)}
              className="w-full h-full flex items-center justify-between px-2 py-1 gap-1.5 text-xs text-g-200 cursor-pointer relative"
            >
              <span>{pageSize}</span>
              <ChevronDown size={12} className="text-[#9C9C9D] shrink-0" />
            </button>

            {open && (
              <div className="absolute z-50 mt-1 w-12.5 rounded-md overflow-hidden border border-[#2F3031] bg-g-700">
                {options.map((value) => (
                  <div
                    key={value}
                    onClick={() => {
                      setPage(1);
                      setPageSize(value);
                      setOpen(false);
                    }}
                    className="px-2 py-1 text-xs text-g-200 cursor-pointer hover:bg-g-600"
                  >
                    {value}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className={`${
              page === 1
                ? "text-[#9C9C9D] cursor-not-allowed"
                : "text-text cursor-pointer"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <p className="text-[#9C9C9D]">
            {page} of {totalPages}
          </p>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className={` ${
              page === totalPages
                ? "text-[#9C9C9D] cursor-not-allowed"
                : "text-text cursor-pointer"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
