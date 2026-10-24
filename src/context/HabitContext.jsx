"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { DEFAULT_HABITS, DEFAULT_PROFILE } from "../data/defaultHabits";
import { generateInitialRecords } from "../data/seedData";
import {
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
  exportBackup,
  validateBackup,
  clearAllStorage
} from "../utils/storage";
import { getTodayDateString } from "../utils/dateUtils";

const HabitContext = createContext(null);

export function HabitProvider({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const [habits, setHabits] = useState([]);
  const [records, setRecords] = useState({});
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  // Selected calendar view month/year (defaults to October 2026, matching reference sheet)
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(9); // 0-indexed: October
  const [todayDateStr, setTodayDateStr] = useState("2026-10-24");

  // Active view tab: 'today' | 'monthly' | 'habits' | 'insights'
  const [activeTab, setActiveTab] = useState("today");

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const now = new Date();
      setViewYear(now.getFullYear());
      setViewMonth(now.getMonth());
      setTodayDateStr(getTodayDateString());

      const storedHabits = loadFromStorage(STORAGE_KEYS.HABITS, null);
      const storedRecords = loadFromStorage(STORAGE_KEYS.RECORDS, null);
      const storedProfile = loadFromStorage(STORAGE_KEYS.PROFILE, null);

      if (storedHabits && Array.isArray(storedHabits) && storedHabits.length > 0) {
        setHabits(storedHabits);
      } else {
        setHabits(DEFAULT_HABITS);
        saveToStorage(STORAGE_KEYS.HABITS, DEFAULT_HABITS);
      }

      if (storedRecords && typeof storedRecords === "object") {
        setRecords(storedRecords);
      } else {
        const initial = generateInitialRecords(now.getFullYear(), now.getMonth());
        setRecords(initial);
        saveToStorage(STORAGE_KEYS.RECORDS, initial);
      }

      if (storedProfile && typeof storedProfile === "object") {
        setProfile({ ...DEFAULT_PROFILE, ...storedProfile });
      } else {
        setProfile(DEFAULT_PROFILE);
        saveToStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
      }
    } catch (err) {
      console.error("Failed to load habit store:", err);
      setHabits(DEFAULT_HABITS);
      setRecords({});
      setProfile(DEFAULT_PROFILE);
    } finally {
      setIsMounted(true);
    }
  }, []);

  // Save changes to localStorage whenever habits, records, or profile changes (after mounting)
  useEffect(() => {
    if (!isMounted) return;
    saveToStorage(STORAGE_KEYS.HABITS, habits);
  }, [habits, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    saveToStorage(STORAGE_KEYS.RECORDS, records);
  }, [records, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    saveToStorage(STORAGE_KEYS.PROFILE, profile);
  }, [profile, isMounted]);

  /**
   * Cycle cell status: undefined -> completed -> skipped -> undefined
   */
  const toggleHabit = useCallback((habitId, dateStr) => {
    const targetDate = dateStr || todayDateStr;
    setRecords(prev => {
      const dayRecord = prev[targetDate] || {};
      const currentStatus = dayRecord[habitId];

      let nextStatus = undefined;
      if (!currentStatus) {
        nextStatus = "completed";
      } else if (currentStatus === "completed") {
        nextStatus = "skipped";
      } else if (currentStatus === "skipped") {
        nextStatus = undefined;
      }

      const updatedDay = { ...dayRecord };
      if (nextStatus) {
        updatedDay[habitId] = nextStatus;
      } else {
        delete updatedDay[habitId];
      }

      return {
        ...prev,
        [targetDate]: updatedDay
      };
    });
  }, [todayDateStr]);

  /**
   * Directly set status: 'completed' | 'skipped' | null
   */
  const setHabitStatus = useCallback((habitId, dateStr, status) => {
    const targetDate = dateStr || todayDateStr;
    setRecords(prev => {
      const dayRecord = { ...(prev[targetDate] || {}) };
      if (status) {
        dayRecord[habitId] = status;
      } else {
        delete dayRecord[habitId];
      }
      return {
        ...prev,
        [targetDate]: dayRecord
      };
    });
  }, [todayDateStr]);

  /**
   * Mark all active habits for today as completed
   */
  const markAllTodayDone = useCallback(() => {
    const targetDate = todayDateStr;
    setRecords(prev => {
      const updatedDay = { ...(prev[targetDate] || {}) };
      habits.filter(h => !h.archived).forEach(h => {
        updatedDay[h.id] = "completed";
      });
      return {
        ...prev,
        [targetDate]: updatedDay
      };
    });

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // ignore
    }
  }, [habits, todayDateStr]);

  /**
   * Reset today's records
   */
  const resetToday = useCallback(() => {
    setRecords(prev => {
      const next = { ...prev };
      delete next[todayDateStr];
      return next;
    });
  }, [todayDateStr]);

  /**
   * Habit CRUD operations
   */
  const addHabit = useCallback((newHabitData) => {
    const newId = `habit_${Date.now()}`;
    const newHabit = {
      id: newId,
      name: newHabitData.name.trim(),
      category: newHabitData.category || "Health",
      icon: newHabitData.icon || "CheckCircle",
      color: newHabitData.color || "#2D5A43",
      frequency: newHabitData.frequency || "daily",
      customDays: newHabitData.customDays || [0, 1, 2, 3, 4, 5, 6],
      order: habits.length + 1,
      archived: false,
      createdAt: todayDateStr
    };

    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  }, [habits.length, todayDateStr]);

  const updateHabit = useCallback((habitId, updatedData) => {
    setHabits(prev =>
      prev.map(h => (h.id === habitId ? { ...h, ...updatedData } : h))
    );
  }, []);

  const deleteHabit = useCallback((habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  }, []);

  const moveHabit = useCallback((fromIndex, toIndex) => {
    setHabits(prev => {
      const list = [...prev];
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return list.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  }, []);

  const updateProfile = useCallback((newProfileData) => {
    setProfile(prev => ({ ...prev, ...newProfileData }));
  }, []);

  /**
   * Month Navigation
   */
  const goToNextMonth = useCallback(() => {
    setViewMonth(prev => {
      if (prev === 11) {
        setViewYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const goToPrevMonth = useCallback(() => {
    setViewMonth(prev => {
      if (prev === 0) {
        setViewYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const goToTodayMonth = useCallback(() => {
    const d = new Date();
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, []);

  /**
   * Import & Export
   */
  const handleExportBackup = useCallback(() => {
    exportBackup(habits, records, profile);
  }, [habits, records, profile]);

  const handleImportBackup = useCallback((importedJson) => {
    const validation = validateBackup(importedJson);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    setHabits(importedJson.habits);
    setRecords(importedJson.records);
    if (importedJson.profile) {
      setProfile(importedJson.profile);
    }
    return true;
  }, []);

  const handleResetToDefaults = useCallback(() => {
    setHabits(DEFAULT_HABITS);
    const initialRecords = generateInitialRecords(viewYear, viewMonth);
    setRecords(initialRecords);
    setProfile(DEFAULT_PROFILE);
    saveToStorage(STORAGE_KEYS.HABITS, DEFAULT_HABITS);
    saveToStorage(STORAGE_KEYS.RECORDS, initialRecords);
    saveToStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  }, [viewYear, viewMonth]);

  const handleClearAllData = useCallback(() => {
    clearAllStorage();
    setHabits([]);
    setRecords({});
    setProfile(DEFAULT_PROFILE);
  }, []);

  const value = {
    isMounted,
    habits,
    records,
    profile,
    viewYear,
    viewMonth,
    todayDateStr,
    activeTab,
    setActiveTab,
    setViewYear,
    setViewMonth,
    toggleHabit,
    setHabitStatus,
    markAllTodayDone,
    resetToday,
    addHabit,
    updateHabit,
    deleteHabit,
    moveHabit,
    updateProfile,
    goToNextMonth,
    goToPrevMonth,
    goToTodayMonth,
    handleExportBackup,
    handleImportBackup,
    handleResetToDefaults,
    handleClearAllData
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
}
