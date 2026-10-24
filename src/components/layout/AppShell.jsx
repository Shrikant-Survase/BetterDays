"use client";

import React, { Suspense } from "react";
import { HabitProvider, useHabits } from "@/context/HabitContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TodayView from "../today/TodayView";
import MonthlyTracker from "../monthly/MonthlyTracker";
import HabitManager from "../habits/HabitManager";
import InsightsView from "../insights/InsightsView";

function MainContent() {
  const { activeTab, isMounted } = useHabits();

  if (!isMounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#2D5A43] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-serif">Opening your habit tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {activeTab === "today" && <TodayView />}
      {activeTab === "monthly" && <MonthlyTracker />}
      {activeTab === "habits" && <HabitManager />}
      {activeTab === "insights" && <InsightsView />}
    </main>
  );
}

export default function AppShell() {
  return (
    <HabitProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-900 selection:bg-[#E8F0EB] selection:text-[#2D5A43]">
        <Navbar />
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
              <div className="w-8 h-8 border-2 border-[#2D5A43] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          }
        >
          <MainContent />
        </Suspense>
        <Footer />
      </div>
    </HabitProvider>
  );
}
