"use client";

import React, { useState } from "react";
import {
  Calendar,
  CheckSquare,
  BarChart3,
  ListTodo,
  Download,
  Settings,
  Image as ImageIcon,
  Flame,
  FileSpreadsheet,
  Sprout
} from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { calculateOverallStreak } from "@/utils/statsUtils";
import BackupModal from "../backup/BackupModal";
import ProfileModal from "../backup/ProfileModal";
import ReferenceModal from "./ReferenceModal";

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    habits,
    records,
    profile,
    todayDateStr,
    isMounted
  } = useHabits();

  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);

  // Today's summary numbers
  const todayRecords = records[todayDateStr] || {};
  const activeHabits = habits.filter(h => !h.archived);
  const completedTodayCount = isMounted
    ? activeHabits.filter(h => todayRecords[h.id] === "completed").length
    : 0;

  const currentStreak = isMounted ? calculateOverallStreak(records) : 0;

  const navItems = [
    {
      id: "today",
      label: "Today",
      icon: Sprout,
      badge: isMounted ? `${completedTodayCount}/${activeHabits.length}` : null
    },
    {
      id: "monthly",
      label: "Monthly Sheet",
      icon: FileSpreadsheet,
      badge: "Paper Grid"
    },
    {
      id: "habits",
      label: "Habits",
      icon: ListTodo,
      badge: activeHabits.length
    },
    {
      id: "insights",
      label: "Insights",
      icon: BarChart3
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E2DBD0] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand & Tagline */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("today")}
                className="flex items-center gap-2.5 text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center shadow-xs group-hover:bg-[#234735] transition-colors">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-lg text-stone-900 tracking-tight">
                      BetterDays
                    </span>
                    <span className="text-[10px] uppercase font-mono font-bold bg-[#E8F0EB] text-[#2D5A43] px-1.5 py-0.5 rounded border border-[#C5DACB]">
                      Tracker
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {profile.tagline || "Becoming Better"}
                  </p>
                </div>
              </button>

              {/* Current Streak Indicator */}
              {isMounted && currentStreak > 0 && (
                <div className="hidden md:flex items-center gap-1.5 ml-3 pl-3 border-l border-[#E2DBD0] text-xs font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  <span>{currentStreak} day streak</span>
                </div>
              )}
            </div>

            {/* Center: Navigation Tabs */}
            <nav className="flex items-center gap-1 bg-[#EBE5DA] p-1 rounded-xl border border-[#DCD5C8]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all select-none ${
                      isActive
                        ? "bg-white text-stone-900 shadow-xs font-semibold"
                        : "text-stone-600 hover:text-stone-900 hover:bg-[#F3EFE7]"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#2D5A43]" : "text-stone-500"}`} />
                    <span className="hidden sm:inline">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          isActive
                            ? "bg-[#E8F0EB] text-[#2D5A43] font-bold"
                            : "bg-[#DFD8CC] text-stone-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsReferenceOpen(true)}
                title="View original reference paper tracker"
                className="hidden lg:flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 bg-white hover:bg-[#F5F1E9] border border-[#D5CEC2] px-2.5 py-1.5 rounded-lg transition-colors font-medium"
              >
                <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                <span>Reference</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBackupOpen(true)}
                title="Backup, export, or import data"
                className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 bg-white hover:bg-[#F5F1E9] border border-[#D5CEC2] px-2.5 py-1.5 rounded-lg transition-colors font-medium"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Data</span>
              </button>

              <button
                type="button"
                onClick={() => setIsProfileOpen(true)}
                title="Profile & Settings"
                className="p-1.5 text-stone-600 hover:text-stone-900 bg-white hover:bg-[#F5F1E9] border border-[#D5CEC2] rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 text-stone-500" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Modals */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <ReferenceModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />
    </>
  );
}
