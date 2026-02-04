import { useEffect, useRef } from "react";

/**
 * Triggers callback ONLY when value(s) change (not on initial mount)
 *
 * @param values - single value or array of values
 * @param callback - function to run on change
 */
const useDidChange = (
  values,
  callback,
) => {
  const isFirstRender = useRef(true);
  const prevValues = useRef([]);

  const deps = Array.isArray(values) ? values : [values];

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevValues.current = deps;
      return;
    }

    const hasChanged = deps.some(
      (val, index) => !Object.is(val, prevValues.current[index])
    );

    if (hasChanged) {
      callback();
      prevValues.current = deps;
    }
  }, deps);
};

export default useDidChange;
