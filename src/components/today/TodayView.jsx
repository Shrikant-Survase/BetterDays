"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  Flame,
  CheckCheck,
  RotateCcw,
  ListTodo,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { formatFriendlyDate, getGreeting } from "@/utils/dateUtils";
import { calculateOverallStreak } from "@/utils/statsUtils";
import HabitCard from "./HabitCard";
import Button from "../ui/Button";
import ProgressBar from "../ui/ProgressBar";
import HabitModal from "../habits/HabitModal";

export default function TodayView() {
  const {
    habits,
    records,
    profile,
    todayDateStr,
    toggleHabit,
    setHabitStatus,
    markAllTodayDone,
    resetToday,
    setActiveTab
  } = useHabits();

  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'incomplete' | 'completed'
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [todayFormatted, setTodayFormatted] = useState("Today");
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    setTodayFormatted(formatFriendlyDate(new Date()));
    setGreeting(getGreeting());
  }, []);

  const todayRecords = records[todayDateStr] || {};

  const activeHabits = habits
    .filter(h => !h.archived)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const completedHabits = activeHabits.filter(
    h => todayRecords[h.id] === "completed"
  );
  const incompleteHabits = activeHabits.filter(
    h => todayRecords[h.id] !== "completed"
  );

  const completedCount = completedHabits.length;
  const totalCount = activeHabits.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const streak = calculateOverallStreak(records);

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(activeHabits.map(h => h.category)))];

  // Filter habits for view
  const filteredHabits = activeHabits.filter(h => {
    // Status filter
    if (activeFilter === "incomplete" && todayRecords[h.id] === "completed") return false;
    if (activeFilter === "completed" && todayRecords[h.id] !== "completed") return false;
    // Category filter
    if (selectedCategory !== "All" && h.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Hero Banner */}
      <div className="bg-white rounded-2xl border border-[#DDD6C9] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8F0EB]/40 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-stone-500 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>{todayFormatted}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              {greeting}, {profile.name || "shrikant"} ✦
            </h1>
            <p className="text-sm text-stone-600 max-w-md">
              {completedCount === totalCount && totalCount > 0
                ? "✨ Incredible work! You have completed all your daily habits."
                : `You've checked off ${completedCount} of ${totalCount} habits today. Keep the momentum going!`}
            </p>
          </div>

          {/* Right Progress Meter Card */}
          <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-xl border border-[#E3DCD1] w-full md:w-72 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-stone-600">Daily Completion</span>
              <span className="font-mono font-bold text-[#2D5A43] text-sm">
                {completionPercentage}%
              </span>
            </div>

            <ProgressBar
              value={completedCount}
              max={totalCount || 1}
              color={completedCount === totalCount ? "bg-[#2D5A43]" : "bg-[#3A6B52]"}
            />

            <div className="flex items-center justify-between pt-1 text-xs text-stone-500 font-mono">
              <span>{completedCount}/{totalCount} Completed</span>
              <div className="flex items-center gap-1 text-amber-700 font-semibold">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                <span>{streak}d streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-[#ECE5D9]">
          <div className="flex items-center gap-2">
            <Button
              variant="subtleGreen"
              size="sm"
              onClick={markAllTodayDone}
              title="Mark all habits completed for today"
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1" />
              Mark All Done
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetToday}
              title="Reset checkmarks for today"
              className="text-stone-500 hover:text-stone-800"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Today
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("monthly")}
              className="text-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-[#2D5A43]" />
              View Monthly Sheet
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Habit
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-[#EBE4D8] p-1 rounded-xl border border-[#DDD5C7] w-fit">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeFilter === "all"
                ? "bg-white text-stone-900 shadow-2xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            All Habits ({activeHabits.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("incomplete")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeFilter === "incomplete"
                ? "bg-white text-stone-900 shadow-2xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Remaining ({incompleteHabits.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("completed")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeFilter === "completed"
                ? "bg-white text-stone-900 shadow-2xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Completed ({completedHabits.length})
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#2D5A43] text-white font-medium"
                  : "bg-white text-stone-600 hover:bg-[#F3EEE5] border border-[#DDD6C9]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Habits List */}
      {filteredHabits.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#DDD6C9] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#E8F0EB] text-[#2D5A43] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-serif font-semibold text-stone-800">
            No habits in this view
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {activeFilter === "incomplete"
              ? "All caught up! You completed every habit in this filter."
              : "No habits match your selected filter criteria."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveFilter("all");
              setSelectedCategory("All");
            }}
          >
            Show All Habits
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              status={todayRecords[habit.id]}
              onToggle={() => toggleHabit(habit.id, todayDateStr)}
              onSetStatus={(status) => setHabitStatus(habit.id, todayDateStr, status)}
              records={records}
            />
          ))}
        </div>
      )}

      {/* Add Habit Modal */}
      <HabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
