import React from "react";

export default function ProgressBar({
  value = 0,
  max = 100,
  className = "",
  showLabel = false,
  color = "bg-[#2D5A43]"
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full h-2.5 bg-[#E8E2D7] rounded-full overflow-hidden p-0.5 border border-[#D8D0C3]">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-stone-500 mt-1 font-mono">
          <span>{value} of {max} completed</span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
}
