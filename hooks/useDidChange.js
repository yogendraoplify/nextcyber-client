import { useEffect, useRef } from "react";

const useDidChange = (value, callback) => {
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      callback();
      prev.current = value;
    }
  }, [value]);
};

export default useDidChange;