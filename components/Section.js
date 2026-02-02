import React from "react";

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
    <p className="text-gray-300 leading-relaxed">{children}</p>
  </div>
);

export default Section;
