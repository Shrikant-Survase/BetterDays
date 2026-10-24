"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from "recharts";

export default function MonthScoreGraph({
  data = [],
  maxHabits = 14,
  todayDay = null
}) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-stone-900 text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg border border-stone-700 font-mono">
          <div className="font-semibold">Day {item.day}</div>
          <div className="text-emerald-300">
            {item.score} of {item.maxScore} habits done ({item.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-36">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="scorePaperGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2D5A43" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2D5A43" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="2 2"
            stroke="#E4DCD0"
            vertical={true}
            horizontal={true}
          />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: "#78716C", fontFamily: "monospace" }}
            interval={0}
            stroke="#D5CEC2"
            tickLine={{ stroke: "#D5CEC2" }}
          />
          <YAxis
            domain={[0, Math.max(maxHabits, 5)]}
            tick={{ fontSize: 10, fill: "#78716C", fontFamily: "monospace" }}
            stroke="#D5CEC2"
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {todayDay && (
            <ReferenceLine
              x={todayDay}
              stroke="#D97706"
              strokeDasharray="3 3"
              strokeWidth={1.5}
            />
          )}

          <Area
            type="monotone"
            dataKey="score"
            stroke="#1E3E2E"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#scorePaperGradient)"
            dot={{ r: 2.5, fill: "#1E3E2E", strokeWidth: 1 }}
            activeDot={{ r: 5, fill: "#2D5A43", stroke: "#FFFFFF", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
