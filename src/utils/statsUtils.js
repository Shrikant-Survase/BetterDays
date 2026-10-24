import { formatDateString, getTodayDateString, parseDateString } from "./dateUtils";

/**
 * Calculates current streak across all days (days where at least 1 habit was completed)
 */
export function calculateOverallStreak(records) {
  if (!records) return 0;
  let streak = 0;
  const today = new Date();
  
  // Check today first
  let checkDate = new Date(today);
  const todayStr = getTodayDateString();
  const todayRecords = records[todayStr];
  const hasCompletedToday = todayRecords && Object.values(todayRecords).some(v => v === "completed");

  if (!hasCompletedToday) {
    // If today is not completed yet, streak could still be active from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = formatDateString(
      checkDate.getFullYear(),
      checkDate.getMonth(),
      checkDate.getDate()
    );
    const dayRecords = records[dateStr];
    const isCompleted = dayRecords && Object.values(dayRecords).some(v => v === "completed");

    if (isCompleted) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculates current streak for a specific habit
 */
export function calculateHabitStreak(records, habitId) {
  if (!records || !habitId) return 0;
  let streak = 0;
  const today = new Date();
  let checkDate = new Date(today);
  
  const todayStr = getTodayDateString();
  const completedToday = records[todayStr]?.[habitId] === "completed";

  if (!completedToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = formatDateString(
      checkDate.getFullYear(),
      checkDate.getMonth(),
      checkDate.getDate()
    );
    const isCompleted = records[dateStr]?.[habitId] === "completed";
    if (isCompleted) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculates consistency percentage for a habit over the last N days
 */
export function calculateHabitConsistency(records, habitId, days = 30) {
  if (!records || !habitId) return 0;
  let completedCount = 0;
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDateString(d.getFullYear(), d.getMonth(), d.getDate());
    if (records[dateStr]?.[habitId] === "completed") {
      completedCount++;
    }
  }

  return Math.round((completedCount / days) * 100);
}

/**
 * Calculates daily score (count of completed habits) for a specific date
 */
export function getDailyScore(records, dateStr, habits) {
  if (!records || !records[dateStr]) return 0;
  const dayRecord = records[dateStr];
  const activeHabitIds = new Set(
    (habits || []).filter(h => !h.archived).map(h => h.id)
  );

  let count = 0;
  Object.entries(dayRecord).forEach(([hId, status]) => {
    if (status === "completed" && (activeHabitIds.size === 0 || activeHabitIds.has(hId))) {
      count++;
    }
  });
  return count;
}

/**
 * Aggregates daily completion scores for an entire month (1 to daysInMonth)
 * Formatted directly for Recharts
 */
export function getMonthScoreChartData(records, habits, year, monthIndex, totalDays) {
  const data = [];
  const activeHabitsCount = habits.filter(h => !h.archived).length || 14;

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = formatDateString(year, monthIndex, day);
    const score = getDailyScore(records, dateStr, habits);
    
    data.push({
      day: day,
      dateStr,
      score: score,
      maxScore: activeHabitsCount,
      percentage: Math.round((score / activeHabitsCount) * 100)
    });
  }

  return data;
}

/**
 * Returns breakdown by Day of Week (Sun - Sat) for the last 60 days
 */
export function getDayOfWeekBreakdown(records, habits) {
  const dayTotals = [
    { day: "Sun", completed: 0, total: 0 },
    { day: "Mon", completed: 0, total: 0 },
    { day: "Tue", completed: 0, total: 0 },
    { day: "Wed", completed: 0, total: 0 },
    { day: "Thu", completed: 0, total: 0 },
    { day: "Fri", completed: 0, total: 0 },
    { day: "Sat", completed: 0, total: 0 }
  ];

  if (!records) return dayTotals;

  const today = new Date();
  const activeCount = (habits || []).filter(h => !h.archived).length || 1;

  for (let i = 0; i < 35; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayIndex = d.getDay();
    const dateStr = formatDateString(d.getFullYear(), d.getMonth(), d.getDate());
    const score = getDailyScore(records, dateStr, habits);

    dayTotals[dayIndex].completed += score;
    dayTotals[dayIndex].total += activeCount;
  }

  return dayTotals.map(item => ({
    ...item,
    rate: item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0
  }));
}

/**
 * Calculates overall summary stats
 */
export function getOverallStats(records, habits) {
  let totalCompletions = 0;
  let daysTracked = 0;
  const activeHabits = (habits || []).filter(h => !h.archived);

  if (records) {
    Object.values(records).forEach(dayObj => {
      let dayCompleted = 0;
      Object.entries(dayObj).forEach(([hId, status]) => {
        if (status === "completed") {
          dayCompleted++;
          totalCompletions++;
        }
      });
      if (dayCompleted > 0) {
        daysTracked++;
      }
    });
  }

  const streak = calculateOverallStreak(records);

  // Find most consistent habit
  let bestHabit = null;
  let bestConsistency = -1;

  activeHabits.forEach(h => {
    const consistency = calculateHabitConsistency(records, h.id, 30);
    if (consistency > bestConsistency) {
      bestConsistency = consistency;
      bestHabit = h;
    }
  });

  return {
    totalCompletions,
    daysTracked,
    streak,
    bestHabit: bestHabit ? { name: bestHabit.name, consistency: bestConsistency } : null
  };
}
