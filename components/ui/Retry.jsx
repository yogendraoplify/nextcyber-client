import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Retry({ error, onRetry }) {
  return (
    <div className="h-[calc(100vh-100.67px)] flex justify-center items-center px-4">
      <div className="w-[420px] rounded-lg overflow-hidden border border-g-500">
        <div className="bg-g-600 p-6 flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-light-red flex items-center justify-center">
            <AlertTriangle size={20} className="text-dark-red" />
          </div>

          <h3 className="text-g-50 text-lg font-semibold text-center">
            Something went wrong
          </h3>

          <p className="text-g-200 text-base leading-6 text-center">
            {error || "Something went wrong. Please try again."}
          </p>
        </div>

        <div className="bg-g-600 px-10 py-6">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 cursor-pointer
                       px-6 py-3 rounded-lg
                       bg-dark-red border border-g-500
                       text-g-100 text-base font-medium
                       hover:opacity-90 transition"
          >
            <RefreshCcw size={18} />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
