"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Printer,
  Sparkles,
  Info
} from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import {
  getDaysInMonth,
  MONTH_NAMES,
  formatDateString,
  getDayOfWeekLetter
} from "@/utils/dateUtils";
import { getMonthScoreChartData, getDailyScore } from "@/utils/statsUtils";
import GridCell from "./GridCell";
import MonthScoreGraph from "./MonthScoreGraph";
import Button from "../ui/Button";

export default function MonthlyTracker() {
  const {
    habits,
    records,
    profile,
    viewYear,
    viewMonth,
    todayDateStr,
    goToPrevMonth,
    goToNextMonth,
    goToTodayMonth,
    toggleHabit,
    setActiveTab
  } = useHabits();

  const totalDays = getDaysInMonth(viewYear, viewMonth);
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Derive today's day and month safely from todayDateStr
  const [currYear, currMonthNum, currDayNum] = (todayDateStr || "2026-10-24")
    .split("-")
    .map(Number);
  const isCurrentMonth = currYear === viewYear && (currMonthNum - 1) === viewMonth;
  const todayDayNumber = isCurrentMonth ? currDayNum : null;

  const activeHabits = habits
    .filter(h => !h.archived)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Chart data for bottom score graph
  const chartData = getMonthScoreChartData(
    records,
    activeHabits,
    viewYear,
    viewMonth,
    totalDays
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Month Navigator Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#DDD6C9] shadow-2xs">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="px-3 py-1 bg-[#FAF7F2] rounded-lg border border-[#D5CEC2] font-serif font-bold text-base text-stone-900 min-w-44 text-center">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {!isCurrentMonth && (
            <Button
              variant="ghost"
              size="sm"
              onClick={goToTodayMonth}
              className="text-xs text-[#2D5A43] font-semibold"
            >
              Back to This Month
            </Button>
          )}
        </div>

        {/* Legend & Hint */}
        <div className="flex items-center gap-4 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-[#EBF2ED] border border-[#B8D5C1] flex items-center justify-center font-bold text-[#2D5A43] text-[10px]">
              ✓
            </span>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-[#F3EFE9] border border-[#DDD7CD] flex items-center justify-center font-bold text-stone-600 text-[10px]">
              ✕
            </span>
            <span>Skipped</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-white border border-[#DDD6C9]" />
            <span>Empty</span>
          </div>
          <span className="hidden md:inline text-stone-400">· Click any cell to cycle status</span>
        </div>
      </div>

      {/* THE PAPER SHEET CONTAINER */}
      <div className="bg-[#FAF7F2] rounded-2xl border-2 border-[#C9C0B1] shadow-md p-4 sm:p-6 lg:p-8 space-y-6 relative overflow-hidden font-sans">
        
        {/* Paper Sheet Header - Directly Inspired by the Reference Image */}
        <div className="border-b-2 border-stone-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="text-left">
            <div className="text-xs font-mono font-bold tracking-wider text-stone-600 uppercase">
              Name: <span className="text-stone-900 font-bold text-sm underline decoration-stone-400 underline-offset-4">{profile.name || "shrikant"}</span>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight uppercase">
              Monthly Habit Tracker
            </h2>
          </div>

          <div className="text-right">
            <div className="text-xs font-mono font-bold tracking-wider text-stone-600 uppercase">
              Month: <span className="text-stone-900 font-bold text-sm underline decoration-stone-400 underline-offset-4">{MONTH_NAMES[viewMonth]}</span>
            </div>
          </div>
        </div>

        {/* The Monthly Grid Table */}
        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-300">
          <table className="min-w-full border-collapse border-2 border-stone-900 text-xs">
            {/* Table Header: Days 1 to 31 */}
            <thead>
              <tr className="bg-[#EFE9DF] text-stone-900 font-bold border-b-2 border-stone-900">
                <th className="p-2.5 text-left font-serif font-bold text-xs uppercase tracking-wider border-r-2 border-stone-900 min-w-56 sm:min-w-64 sticky left-0 bg-[#EFE9DF] z-20">
                  Habits / Protocols
                </th>
                {daysArray.map((day) => {
                  const dayLetter = getDayOfWeekLetter(viewYear, viewMonth, day);
                  const isTodayCol = isCurrentMonth && day === todayDayNumber;
                  return (
                    <th
                      key={day}
                      className={`w-8 sm:w-9 text-center p-1 font-mono border-r border-stone-400 select-none ${
                        isTodayCol ? "bg-[#F7E7C4] text-stone-900 font-extrabold" : ""
                      }`}
                    >
                      <div className="text-[11px] font-bold">{day}</div>
                      <div className="text-[9px] text-stone-500 font-normal">{dayLetter}</div>
                    </th>
                  );
                })}
                <th className="p-1.5 text-center font-serif text-[11px] uppercase tracking-wider min-w-16 border-l-2 border-stone-900">
                  Done
                </th>
              </tr>
            </thead>

            {/* Table Body: Habit Rows */}
            <tbody>
              {activeHabits.map((habit, index) => {
                let habitMonthDoneCount = 0;

                return (
                  <tr
                    key={habit.id}
                    className="hover:bg-[#FAF3E7] transition-colors border-b border-stone-400 group"
                  >
                    {/* Habit Label Column (Sticky) */}
                    <td className="p-2 font-medium text-stone-900 border-r-2 border-stone-900 sticky left-0 bg-[#FAF7F2] group-hover:bg-[#FAF3E7] z-20 shadow-xs">
                      <div className="flex items-center justify-between gap-1">
                        <div className="truncate font-semibold">
                          <span className="font-mono text-stone-500 mr-1.5">
                            {index + 1}.
                          </span>
                          <span>{habit.name}</span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-normal hidden lg:inline">
                          {habit.category}
                        </span>
                      </div>
                    </td>

                    {/* Day Cells (1 to totalDays) */}
                    {daysArray.map((day) => {
                      const dateStr = formatDateString(viewYear, viewMonth, day);
                      const status = records[dateStr]?.[habit.id];
                      if (status === "completed") habitMonthDoneCount++;

                      const isToday = isCurrentMonth && day === todayDayNumber;
                      const isFuture =
                        isCurrentMonth && day > (todayDayNumber || 0);

                      return (
                        <GridCell
                          key={dateStr}
                          status={status}
                          isToday={isToday}
                          isFuture={isFuture}
                          dayNumber={day}
                          habitName={habit.name}
                          onClick={() => toggleHabit(habit.id, dateStr)}
                        />
                      );
                    })}

                    {/* Habit Month Total */}
                    <td className="p-1.5 text-center font-mono font-bold text-stone-800 border-l-2 border-stone-900 bg-[#FAF5EC]">
                      {habitMonthDoneCount}
                    </td>
                  </tr>
                );
              })}

              {/* Bottom "Done!" Daily Score Row matching the reference image */}
              <tr className="bg-[#EFE9DF] border-t-2 border-stone-900 font-mono font-bold text-stone-900">
                <td className="p-2 text-right uppercase tracking-wider font-serif font-bold text-xs border-r-2 border-stone-900 sticky left-0 bg-[#EFE9DF] z-20">
                  Done! Score:
                </td>
                {daysArray.map((day) => {
                  const dateStr = formatDateString(viewYear, viewMonth, day);
                  const dayScore = getDailyScore(records, dateStr, activeHabits);
                  const isTodayCol = isCurrentMonth && day === todayDayNumber;

                  return (
                    <td
                      key={`score_${day}`}
                      className={`text-center p-1 text-[11px] border-r border-stone-400 ${
                        isTodayCol ? "bg-[#F7E7C4] text-[#1E3E2E]" : ""
                      }`}
                    >
                      {dayScore > 0 ? (
                        <span className={dayScore >= 10 ? "text-[#2D5A43] font-black" : ""}>
                          {dayScore}
                        </span>
                      ) : (
                        <span className="text-stone-300">-</span>
                      )}
                    </td>
                  );
                })}
                <td className="p-1.5 text-center border-l-2 border-stone-900 text-xs text-[#2D5A43]">
                  ★
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BOTTOM SECTION: DAILY HABITS SCORE GRAPH */}
        <div className="border-t-2 border-stone-900 pt-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 tracking-tight uppercase">
                Daily habits Score Graph
              </h3>
              <span className="text-xs text-stone-500 font-mono">
                (completed count per day)
              </span>
            </div>
            <div className="text-xs text-stone-500 italic">
              Mirrors the paper tracker's daily plotted score chart
            </div>
          </div>

          {/* Interactive Recharts Score Graph */}
          <div className="bg-white p-3 rounded-xl border border-[#D5CEC2] shadow-2xs">
            <MonthScoreGraph
              data={chartData}
              maxHabits={activeHabits.length}
              todayDay={isCurrentMonth ? todayDayNumber : null}
            />
          </div>
        </div>

        {/* Paper Sheet Footer Tagline - Exactly from reference image */}
        <div className="border-t-2 border-stone-900 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-700 font-mono gap-2">
          <div className="text-stone-500">
            {activeHabits.length} daily habits tracked
          </div>

          <div className="font-serif font-bold text-base text-stone-900 tracking-wider uppercase">
            {profile.tagline || "Becoming Better"}
          </div>

          <div className="text-stone-600">
            created by - <span className="font-semibold">{profile.creatorHandle || "@shrikantyadav0"}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
