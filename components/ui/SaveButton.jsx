import { Loader2 } from "lucide-react";

export function SaveButton({ isLoading=false, type, text="Save", loadingText="Saving..." }) {
  return (
    <button
      type={type}
      aria-busy={isLoading}
      aria-live="polite"
      disabled={isLoading}
      className={`px-5 py-3 ${
        isLoading && "opacity-50 cursor-not-allowed flex bg-primary"
      } rounded-lg text-white text-sm font-medium cursor-pointer bg-primary`}
    >
      {isLoading && (
        <span className="loader">
          <Loader2 className="animate-spin mr-2" size={16} />
        </span>
      )}
      {isLoading ? loadingText : text}
    </button>
  );
}
