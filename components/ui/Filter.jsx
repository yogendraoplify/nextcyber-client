import React from "react";
import SelectField from "../SelectField";

function Filter({ placeholder, options, onChange }) {
  return (
    <div className="w-[200px]">
      <SelectField
        isSearch={false}
        placeholder={placeholder}
        options={options}
        onChange={(val) => {
          onChange(val);
        }}
      />
    </div>
  );
}

export default Filter;
