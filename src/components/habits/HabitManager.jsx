"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Flame,
  CheckCircle2,
  Filter
} from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { calculateHabitStreak, calculateHabitConsistency } from "@/utils/statsUtils";
import DynamicIcon from "../ui/DynamicIcon";
import Button from "../ui/Button";
import { Badge } from "../ui/Badge";
import HabitModal from "./HabitModal";
import Modal from "../ui/Modal";

export default function HabitManager() {
  const {
    habits,
    records,
    moveHabit,
    deleteHabit
  } = useHabits();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingHabit, setEditingHabit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);

  const activeHabits = [...habits]
    .filter(h => !h.archived)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const categories = ["All", ...Array.from(new Set(activeHabits.map(h => h.category)))];

  const filteredHabits = activeHabits.filter(h => {
    if (selectedCategory !== "All" && h.category !== selectedCategory) return false;
    if (searchQuery.trim() && !h.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  function handleDeleteConfirm() {
    if (habitToDelete) {
      deleteHabit(habitToDelete.id);
      setHabitToDelete(null);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDD6C9] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Habit Management
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Organize, reorder, edit, and tailor the habits displayed on your paper tracker.
          </p>
        </div>

        <Button
          variant="default"
          onClick={() => setIsAddModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Habit
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D5CEC2] rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#2D5A43] text-white font-medium shadow-2xs"
                  : "bg-white text-stone-600 hover:bg-[#F3EEE5] border border-[#DDD6C9]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Habit Cards List */}
      {filteredHabits.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#DDD6C9] space-y-3">
          <CheckCircle2 className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-sm font-semibold text-stone-800">No habits found</h3>
          <p className="text-xs text-stone-500">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredHabits.map((habit, index) => {
            const streak = calculateHabitStreak(records, habit.id);
            const consistency = calculateHabitConsistency(records, habit.id, 30);
            const originalIndex = activeHabits.findIndex(h => h.id === habit.id);

            return (
              <div
                key={habit.id}
                className="bg-white p-4 rounded-xl border border-[#DDD6C9] hover:border-[#BFB6A8] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                {/* Left: Order, Icon, Name, Category */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Order Badge */}
                  <span className="w-6 text-center font-mono text-xs font-bold text-stone-400">
                    {index + 1}
                  </span>

                  {/* Icon */}
                  <div className="w-9 h-9 rounded-lg bg-[#E8F0EB] text-[#2D5A43] flex items-center justify-center border border-[#C5DACB] shrink-0">
                    <DynamicIcon name={habit.icon} className="w-5 h-5" />
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-stone-900 truncate">
                      {habit.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500">
                      <span className="bg-[#FAF7F2] px-2 py-0.5 rounded text-[11px] border border-[#E2DBD0]">
                        {habit.category}
                      </span>
                      <span>·</span>
                      <span className="capitalize">{habit.frequency}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Stats & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                  {/* Quick Consistency & Streak */}
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="text-right">
                      <div className="text-stone-900 font-bold">{consistency}%</div>
                      <div className="text-[10px] text-stone-400 uppercase">30d Rate</div>
                    </div>

                    {streak > 0 && (
                      <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                        <span>{streak}d</span>
                      </div>
                    )}
                  </div>

                  {/* Move Up / Down Buttons */}
                  <div className="flex items-center border border-[#DCD5C8] rounded-lg overflow-hidden bg-[#FAF7F2]">
                    <button
                      type="button"
                      disabled={originalIndex === 0}
                      onClick={() => moveHabit(originalIndex, originalIndex - 1)}
                      className="p-1.5 hover:bg-[#EFE8DD] text-stone-600 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move up in tracker"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-5 bg-[#DCD5C8]" />
                    <button
                      type="button"
                      disabled={originalIndex === activeHabits.length - 1}
                      onClick={() => moveHabit(originalIndex, originalIndex + 1)}
                      className="p-1.5 hover:bg-[#EFE8DD] text-stone-600 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move down in tracker"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingHabit(habit)}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-[#F0EAE0] transition-colors"
                      title="Edit habit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setHabitToDelete(habit)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Delete habit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <HabitModal
        isOpen={isAddModalOpen || Boolean(editingHabit)}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingHabit(null);
        }}
        habitToEdit={editingHabit}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(habitToDelete)}
        onClose={() => setHabitToDelete(null)}
        title="Delete Habit"
        description="Are you sure you want to delete this habit?"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-stone-600">
            Deleting <strong>"{habitToDelete?.name}"</strong> will remove it from future tracking. Existing dates with this habit logged will remain in history unless cleared.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHabitToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
            >
              Delete Habit
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
