"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Input, Select } from "../ui/Input";
import DynamicIcon from "../ui/DynamicIcon";
import { CATEGORIES, AVAILABLE_ICONS } from "@/data/defaultHabits";
import { useHabits } from "@/context/HabitContext";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function HabitModal({
  isOpen,
  onClose,
  habitToEdit = null
}) {
  const { addHabit, updateHabit } = useHabits();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Health");
  const [icon, setIcon] = useState("CheckCircle");
  const [frequency, setFrequency] = useState("daily");
  const [customDays, setCustomDays] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [error, setError] = useState("");

  const isEditing = Boolean(habitToEdit);

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name || "");
      setCategory(habitToEdit.category || "Health");
      setIcon(habitToEdit.icon || "CheckCircle");
      setFrequency(habitToEdit.frequency || "daily");
      setCustomDays(habitToEdit.customDays || [0, 1, 2, 3, 4, 5, 6]);
    } else {
      setName("");
      setCategory("Health");
      setIcon("CheckCircle");
      setFrequency("daily");
      setCustomDays([0, 1, 2, 3, 4, 5, 6]);
    }
    setError("");
  }, [habitToEdit, isOpen]);

  function toggleDay(dayIndex) {
    setCustomDays(prev => {
      if (prev.includes(dayIndex)) {
        if (prev.length === 1) return prev; // Keep at least one day
        return prev.filter(d => d !== dayIndex);
      }
      return [...prev, dayIndex].sort();
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a habit name.");
      return;
    }

    if (isEditing) {
      updateHabit(habitToEdit.id, {
        name: name.trim(),
        category,
        icon,
        frequency,
        customDays: frequency === "daily" ? [0, 1, 2, 3, 4, 5, 6] : customDays
      });
    } else {
      addHabit({
        name: name.trim(),
        category,
        icon,
        frequency,
        customDays: frequency === "daily" ? [0, 1, 2, 3, 4, 5, 6] : customDays
      });
    }

    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Habit" : "Create New Habit"}
      description={
        isEditing
          ? "Update habit details. Existing completion history will be preserved."
          : "Add a new daily habit or protocol to your tracker."
      }
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Habit Name"
          id="habit_name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          placeholder="e.g. 20-min Morning Run"
          error={error}
          autoFocus
        />

        {/* Category & Icon Picker */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            id="habit_category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORIES.filter(c => c !== "All")}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
              Icon
            </label>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#E8F0EB] text-[#2D5A43] flex items-center justify-center border border-[#C5DACB] shrink-0">
                <DynamicIcon name={icon} className="w-5 h-5" />
              </div>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-white border border-[#D5CEC2] rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
              >
                {AVAILABLE_ICONS.map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
            Frequency
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFrequency("daily")}
              className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                frequency === "daily"
                  ? "bg-[#2D5A43] text-white border-[#2D5A43]"
                  : "bg-white text-stone-700 border-[#D5CEC2] hover:bg-[#F5F1E9]"
              }`}
            >
              Every Day
            </button>
            <button
              type="button"
              onClick={() => setFrequency("custom")}
              className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                frequency === "custom"
                  ? "bg-[#2D5A43] text-white border-[#2D5A43]"
                  : "bg-white text-stone-700 border-[#D5CEC2] hover:bg-[#F5F1E9]"
              }`}
            >
              Selected Weekdays
            </button>
          </div>

          {frequency === "custom" && (
            <div className="flex items-center justify-between pt-2">
              {DAY_LABELS.map((label, idx) => {
                const isSelected = customDays.includes(idx);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-[#2D5A43] text-white"
                        : "bg-[#EAE4D9] text-stone-600 hover:bg-[#DFD8CC]"
                    }`}
                  >
                    {label[0]}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-[#E5DFD4]">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" type="submit">
            {isEditing ? "Save Changes" : "Add Habit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
