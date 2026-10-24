import React from "react";

export function Input({
  label,
  error,
  id,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3.5 py-2 text-sm bg-white border border-[#D5CEC2] rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2D5A43] focus:border-transparent transition-all shadow-2xs ${
          error ? "border-red-400 focus:ring-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  options = [],
  id,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-3.5 py-2 text-sm bg-white border border-[#D5CEC2] rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2D5A43] focus:border-transparent transition-all shadow-2xs ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-[#EAE4D9] text-stone-700 border border-[#DCD5C8]",
    green: "bg-[#E8F0EB] text-[#2D5A43] border border-[#C6DC CE]",
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
