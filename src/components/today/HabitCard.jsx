"use client";

import React from "react";
import { Check, X, Flame } from "lucide-react";
import DynamicIcon from "../ui/DynamicIcon";
import { Badge } from "../ui/Badge";
import { calculateHabitStreak } from "@/utils/statsUtils";

export default function HabitCard({
  habit,
  status,
  onToggle,
  onSetStatus,
  records
}) {
  const isCompleted = status === "completed";
  const isSkipped = status === "skipped";
  const streak = calculateHabitStreak(records, habit.id);

  return (
    <div
      onClick={onToggle}
      className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
        isCompleted
          ? "bg-[#F3F7F4] border-[#B8D5C1] shadow-2xs"
          : isSkipped
          ? "bg-[#F6F4F0] border-[#DDD7CD] opacity-75"
          : "bg-white border-[#DDD6C9] hover:border-[#BFB6A8] hover:shadow-xs"
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Toggle Checkmark button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
            isCompleted
              ? "bg-[#2D5A43] text-white shadow-xs"
              : isSkipped
              ? "bg-stone-300 text-stone-700"
              : "border-2 border-[#C9C2B5] text-transparent hover:border-[#2D5A43] group-hover:border-stone-400"
          }`}
          aria-label={isCompleted ? "Completed" : isSkipped ? "Skipped" : "Mark as completed"}
        >
          {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
          {isSkipped && <X className="w-4 h-4 stroke-[2.5]" />}
        </button>

        {/* Icon & Habit Name */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium transition-colors ${
                isCompleted
                  ? "text-stone-900 line-through decoration-stone-400 font-normal"
                  : isSkipped
                  ? "text-stone-500 line-through"
                  : "text-stone-900 font-semibold"
              }`}
            >
              {habit.order ? `${habit.order}. ` : ""}{habit.name}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-stone-500 font-medium">
              {habit.category}
            </span>
            {streak > 0 && (
              <>
                <span className="text-stone-300 text-xs">·</span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  <Flame className="w-3 h-3 fill-amber-500 text-amber-600" />
                  {streak}d
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right status badge / action */}
      <div className="flex items-center gap-2">
        {isCompleted ? (
          <Badge variant="green" className="font-mono text-[11px]">
            Done ✓
          </Badge>
        ) : isSkipped ? (
          <Badge variant="paper" className="font-mono text-[11px] text-stone-400">
            Skipped ✕
          </Badge>
        ) : (
          <span className="text-xs text-stone-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Click to check
          </span>
        )}
      </div>
    </div>
  );
}
