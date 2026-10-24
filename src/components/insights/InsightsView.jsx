"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";
import {
  TrendingUp,
  Award,
  Calendar,
  Flame,
  CheckCircle,
  BarChart3,
  Sparkles
} from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { getLastNDays, formatDateString } from "@/utils/dateUtils";
import {
  calculateOverallStreak,
  calculateHabitConsistency,
  calculateHabitStreak,
  getDailyScore,
  getDayOfWeekBreakdown,
  getOverallStats
} from "@/utils/statsUtils";
import DynamicIcon from "../ui/DynamicIcon";
import ProgressBar from "../ui/ProgressBar";

export default function InsightsView() {
  const { habits, records, isMounted } = useHabits();

  const [trendData, setTrendData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [stats, setStats] = useState({ totalCompletions: 0, daysTracked: 0, streak: 0, bestHabit: null });

  const activeHabits = habits
    .filter(h => !h.archived)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const streak = calculateOverallStreak(records);

  useEffect(() => {
    if (!isMounted) return;

    // 1. Last 30 Days Trend Data for Recharts Line Chart
    const last30Days = getLastNDays(30);
    const trend = last30Days.map(item => {
      const score = getDailyScore(records, item.dateStr, activeHabits);
      const maxScore = activeHabits.length || 1;
      return {
        date: item.dayName + " " + item.day,
        dateStr: item.dateStr,
        score: score,
        percentage: Math.round((score / maxScore) * 100),
        max: maxScore
      };
    });
    setTrendData(trend);

    // 2. Day of Week Breakdown Data for Recharts Bar Chart
    const weekly = getDayOfWeekBreakdown(records, activeHabits);
    setWeeklyData(weekly);

    // 3. Overall summary stats
    const overall = getOverallStats(records, habits);
    setStats(overall);
  }, [records, habits, isMounted]);

  // Habit-wise Consistency Leaderboard
  const consistencyList = activeHabits
    .map(h => ({
      ...h,
      rate: calculateHabitConsistency(records, h.id, 30),
      streak: calculateHabitStreak(records, h.id)
    }))
    .sort((a, b) => b.rate - a.rate);

  // Custom Recharts Tooltip
  const CustomLineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-stone-700 font-mono">
          <div className="font-semibold">{data.dateStr}</div>
          <div className="text-emerald-300">
            {data.score} of {data.max} completed ({data.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-stone-700 font-mono">
          <div className="font-semibold">{data.day}</div>
          <div className="text-emerald-300">
            {data.completed} completed · {data.rate}% success rate
          </div>
        </div>
      );
    }
    return null;
  };

  if (!isMounted) {
    return (
      <div className="p-16 text-center bg-white rounded-2xl border border-[#DDD6C9]">
        <div className="w-8 h-8 border-2 border-[#2D5A43] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (activeHabits.length === 0) {
    return (
      <div className="p-16 text-center bg-white rounded-2xl border border-[#DDD6C9] space-y-3">
        <BarChart3 className="w-12 h-12 text-stone-300 mx-auto" />
        <h3 className="text-base font-semibold text-stone-900">No habit analytics yet</h3>
        <p className="text-xs text-stone-500">
          Add habits and check them off to generate interactive trend charts and consistency stats.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Completions */}
        <div className="bg-white p-5 rounded-2xl border border-[#DDD6C9] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
              Total Checkmarks
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F0EB] text-[#2D5A43] flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {stats.totalCompletions}
          </div>
          <p className="text-[11px] text-stone-500">
            Across {stats.daysTracked} active logged days
          </p>
        </div>

        {/* Card 2: Current Streak */}
        <div className="bg-white p-5 rounded-2xl border border-[#DDD6C9] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
              Current Streak
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {streak} <span className="text-sm font-normal text-stone-500">days</span>
          </div>
          <p className="text-[11px] text-stone-500">
            Consecutive daily consistency
          </p>
        </div>

        {/* Card 3: Active Habits */}
        <div className="bg-white p-5 rounded-2xl border border-[#DDD6C9] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
              Active Habits
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-stone-700 flex items-center justify-center border border-[#DDD6C9]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {activeHabits.length}
          </div>
          <p className="text-[11px] text-stone-500">
            Tracked on your paper grid
          </p>
        </div>

        {/* Card 4: Top Habit */}
        <div className="bg-white p-5 rounded-2xl border border-[#DDD6C9] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
              Most Consistent
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F0EB] text-[#2D5A43] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-stone-900 truncate">
            {stats.bestHabit ? stats.bestHabit.name : "None yet"}
          </div>
          <p className="text-[11px] text-[#2D5A43] font-mono font-semibold">
            {stats.bestHabit ? `${stats.bestHabit.consistency}% past 30 days` : "Log more days"}
          </p>
        </div>

      </div>

      {/* Row: 30-Day Completion Trend Chart */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDD6C9] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-900">
              Daily Completion Trend (Past 30 Days)
            </h3>
            <p className="text-xs text-stone-500">
              Interactive score trajectory showing completed habit volume day by day.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
            <span className="w-3 h-0.5 bg-[#2D5A43]" />
            <span>Habits Done</span>
          </div>
        </div>

        <div className="h-64 w-full">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#EAE4DA"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#78716C" }}
                  interval={4}
                  stroke="#D5CEC2"
                />
                <YAxis
                  domain={[0, Math.max(activeHabits.length, 5)]}
                  tick={{ fontSize: 10, fill: "#78716C", fontFamily: "monospace" }}
                  stroke="#D5CEC2"
                  allowDecimals={false}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2D5A43"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#2D5A43" }}
                  activeDot={{ r: 6, fill: "#1E3E2E", stroke: "#FFFFFF", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-stone-400">
              No trend data recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Row: Weekly Pattern & Consistency Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Breakdown Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#DDD6C9] shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-900">
              Weekly Rhythm Breakdown
            </h3>
            <p className="text-xs text-stone-500">
              Habit completion rate across days of the week.
            </p>
          </div>

          <div className="h-56 w-full">
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAE4DA" vertical={false} />
                  <XAxis dataKey="day" stroke="#D5CEC2" tick={{ fontSize: 11, fill: "#78716C" }} />
                  <YAxis
                    domain={[0, 100]}
                    unit="%"
                    stroke="#D5CEC2"
                    tick={{ fontSize: 10, fill: "#78716C", fontFamily: "monospace" }}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                    {weeklyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.rate >= 70 ? "#2D5A43" : entry.rate >= 40 ? "#527D67" : "#A6BEB0"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                Loading weekly chart...
              </div>
            )}
          </div>
        </div>

        {/* Consistency Leaderboard */}
        <div className="bg-white p-6 rounded-2xl border border-[#DDD6C9] shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-900">
              Habit Consistency Leaderboard
            </h3>
            <p className="text-xs text-stone-500">
              30-day adherence rate for each habit.
            </p>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {consistencyList.map((item, idx) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-4 font-mono text-stone-400 font-bold">
                      {idx + 1}.
                    </span>
                    <span className="font-semibold text-stone-800 truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono shrink-0">
                    {item.streak > 0 && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded border border-amber-200">
                        {item.streak}d
                      </span>
                    )}
                    <span className="font-bold text-stone-900">{item.rate}%</span>
                  </div>
                </div>

                <ProgressBar
                  value={item.rate}
                  max={100}
                  color={
                    item.rate >= 75
                      ? "bg-[#2D5A43]"
                      : item.rate >= 50
                      ? "bg-[#527D67]"
                      : "bg-amber-600"
                  }
                />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
