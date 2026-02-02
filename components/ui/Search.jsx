import { Search as SearchIcon, X } from "lucide-react";
import React, { useEffect, useRef } from "react";

function Search({
  value,
  setValue,
  placeholder,
  className,
  handleClear = () => {},
  clearOnUnmount = () => {},
}) {
  const searchTermRef = useRef(value);

  useEffect(() => {
    searchTermRef.current = value;
  }, [value]);

  useEffect(() => {
    return () => {
      if (searchTermRef.current.length > 0) clearOnUnmount?.();
    };
  }, []);

  return (
    <div className={`w-[320px] ${className}`}>
      <div className="flex items-center gap-2 bg-[#111214] border border-[#2F3031] rounded-lg px-5 py-4">
        <SearchIcon size={20} className="text-[#9C9C9D] shrink-0" />
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-transparent text-sm text-[#9C9C9D] outline-none w-full"
        />
        {value && (
          <button onClick={handleClear}>
            <X
              size={20}
              className=" text-g-200 cursor-pointer hover:text-g-100 shrink-0"
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default Search;
