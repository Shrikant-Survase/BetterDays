"use client";

import React from "react";
import { Check, X } from "lucide-react";

export default function GridCell({
  status,
  isToday = false,
  isFuture = false,
  onClick,
  dayNumber,
  habitName
}) {
  const isCompleted = status === "completed";
  const isSkipped = status === "skipped";

  return (
    <td
      onClick={onClick}
      title={`Day ${dayNumber} · ${habitName}: ${
        isCompleted ? "Completed (✓)" : isSkipped ? "Skipped (✕)" : "Click to log"
      }`}
      className={`h-9 w-8 sm:w-9 text-center p-0 cursor-pointer border border-[#D5CEC2] select-none transition-colors duration-100 relative ${
        isToday ? "bg-[#FAF1DD]/60 hover:bg-[#FAF1DD]" : "hover:bg-[#EFE8DD]"
      } ${
        isCompleted
          ? "bg-[#EBF2ED]/90"
          : isSkipped
          ? "bg-[#F3EFE9]/80"
          : isFuture
          ? "opacity-60"
          : ""
      }`}
    >
      <div className="w-full h-full flex items-center justify-center">
        {isCompleted && (
          <Check className="w-4 h-4 text-[#244936] stroke-[2.8] transform scale-110 drop-shadow-2xs animate-in zoom-in-50 duration-100" />
        )}
        {isSkipped && (
          <X className="w-3.5 h-3.5 text-stone-600 stroke-[2.2] animate-in zoom-in-50 duration-100" />
        )}
        {!isCompleted && !isSkipped && (
          <span className="w-1 h-1 rounded-full bg-stone-300 opacity-0 group-hover:opacity-40" />
        )}
      </div>
    </td>
  );
}
