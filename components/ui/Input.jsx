import { forwardRef } from "react";

export const Input = forwardRef(
  ({ label, placeholder, className = "", error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-sm font-medium text-g-200 leading-5">
            {label}
          </label>
        )}

        <input
          ref={ref}
          placeholder={placeholder}
          className={`py-4 px-5 rounded-lg bg-g-700 border
          ${error ? "border-dark-red" : "border-g-500"}
          text-g-300 placeholder-[#6A6B6C] outline-none 
          ${className}`}
          {...props}
        />

        {error && <p className="text-dark-red text-xs">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
