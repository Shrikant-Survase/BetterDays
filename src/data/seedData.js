/**
 * Seed data matching the reference paper tracker sheet for October.
 * In the image, days 1 to 18 have checkmarks (✓) and crosses (✕).
 */

export function generateInitialRecords(year = 2026, month = 9) { // month 9 = October (0-indexed)
  const records = {};
  
  // Pattern extracted from the reference sheet for days 1 to 18:
  // habit_1 (6hr sleep): mostly completed ✓
  // habit_2 (Workout): completed ✓, with occasional skips ✕
  // habit_3 (Praying): completed ✓, day 7 skipped
  // habit_4 (Chanting 16 mala): skips ✕ and checks ✓
  // habit_5 (Drink 3L Water): mostly ✓
  // etc.
  
  // Let's create an authentic representation for days 1 through 18:
  const completionMap = {
    1:  ["habit_1", "habit_2", "habit_3", "habit_5", "habit_6", "habit_10", "habit_12", "habit_13", "habit_14"],
    2:  ["habit_1", "habit_2", "habit_3", "habit_5", "habit_6", "habit_9", "habit_10", "habit_12", "habit_13", "habit_14"],
    3:  ["habit_1", "habit_2", "habit_3", "habit_5", "habit_6", "habit_8", "habit_9", "habit_11", "habit_12", "habit_13", "habit_14"],
    4:  ["habit_1", "habit_2", "habit_3", "habit_5", "habit_6", "habit_10", "habit_12", "habit_13", "habit_14"],
    5:  ["habit_1", "habit_3", "habit_5", "habit_6", "habit_12", "habit_13", "habit_14"],
    6:  ["habit_1", "habit_2", "habit_3", "habit_5", "habit_12", "habit_13", "habit_14"],
    7:  ["habit_1", "habit_2", "habit_5", "habit_12", "habit_13"],
    8:  ["habit_1", "habit_5", "habit_13"],
    9:  ["habit_1", "habit_2", "habit_3", "habit_5", "habit_6", "habit_7", "habit_8", "habit_10", "habit_12", "habit_13", "habit_14", "habit_9"],
    10: ["habit_1", "habit_2", "habit_3", "habit_5", "habit_6", "habit_10", "habit_12", "habit_13", "habit_14"],
    11: ["habit_1", "habit_2", "habit_3", "habit_5", "habit_6", "habit_12", "habit_13", "habit_14"],
    12: ["habit_1", "habit_2", "habit_3", "habit_5", "habit_6", "habit_12", "habit_13", "habit_14"],
    13: ["habit_1", "habit_2", "habit_3", "habit_5", "habit_6", "habit_12", "habit_13"],
    14: ["habit_1", "habit_2", "habit_3", "habit_5", "habit_6", "habit_12", "habit_13", "habit_14"],
    15: ["habit_1", "habit_2", "habit_3", "habit_5", "habit_6", "habit_12", "habit_13", "habit_14"],
    16: ["habit_1", "habit_2", "habit_3", "habit_5", "habit_6", "habit_12", "habit_13", "habit_14"],
    17: ["habit_1", "habit_2", "habit_3", "habit_5", "habit_6", "habit_10", "habit_12", "habit_13", "habit_14"],
    18: ["habit_1", "habit_2", "habit_3", "habit_5", "habit_6", "habit_7", "habit_8", "habit_10", "habit_12", "habit_13", "habit_14"]
  };

  const allHabitIds = Array.from({ length: 14 }, (_, i) => `habit_${i + 1}`);

  for (let day = 1; day <= 18; day++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    records[dayStr] = {};
    const completedList = completionMap[day] || [];

    allHabitIds.forEach((hId) => {
      if (completedList.includes(hId)) {
        records[dayStr][hId] = "completed";
      } else {
        records[dayStr][hId] = "skipped";
      }
    });
  }

  // Also prefill some records for the current local date if different from October 2026,
  // so today has realistic data immediately when opened!
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  if (!records[todayStr]) {
    records[todayStr] = {
      habit_1: "completed",
      habit_2: "completed",
      habit_3: "completed",
      habit_5: "completed",
      habit_8: "completed",
      habit_12: "completed",
      habit_13: "completed"
    };
  }

  return records;
}
