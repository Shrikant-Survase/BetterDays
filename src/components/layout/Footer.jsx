"use client";

import React from "react";
import { ShieldCheck, Heart } from "lucide-react";
import { useHabits } from "@/context/HabitContext";

export default function Footer() {
  const { profile } = useHabits();

  return (
    <footer className="mt-auto border-t border-[#E4DDD2] bg-[#FAF7F2] py-8 text-stone-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-800">BetterDays</span>
            <span>·</span>
            <span className="italic">{profile.tagline || "Becoming Better"}</span>
            {profile.creatorHandle && (
              <>
                <span>·</span>
                <span className="font-mono text-stone-600">created for {profile.name || "shrikant"}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <div className="flex items-center gap-1.5 bg-[#EFE9DF] px-2.5 py-1 rounded-md border border-[#E0D7C9]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>100% Private Local Storage · Zero cloud / cookies</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
