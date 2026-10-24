import React from "react";

export function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-[#EAE4D9] text-stone-700 border border-[#DCD5C8]",
    green: "bg-[#E8F0EB] text-[#2D5A43] border border-[#C6DCCE]",
    amber: "bg-amber-100 text-amber-800 border border-amber-200",
    red: "bg-red-50 text-red-700 border border-red-200",
    paper: "bg-white text-stone-600 border border-[#DCD5C8]"
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
