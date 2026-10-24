/**
 * Date utilities for BetterDays habit tracker.
 * Zero external date library dependencies to keep performance lightning fast.
 */

export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateString(year, monthIndex, day) {
  const y = String(year);
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateString(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getDaysInMonth(year, monthIndex) {
  // monthIndex: 0-based (0 = Jan, 11 = Dec)
  return new Date(year, monthIndex + 1, 0).getDate();
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export function getDayOfWeekLetter(year, monthIndex, day) {
  const d = new Date(year, monthIndex, day);
  return DAY_LETTERS[d.getDay()];
}

export function getDayOfWeekShort(year, monthIndex, day) {
  const d = new Date(year, monthIndex, day);
  return DAY_NAMES_SHORT[d.getDay()];
}

export function formatFriendlyDate(dateObj = new Date()) {
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
  const monthName = dateObj.toLocaleDateString("en-US", { month: "short" });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  return `${dayName}, ${monthName} ${day}, ${year}`;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/**
 * Generates an array of date objects/strings for the last N days up to today
 */
export function getLastNDays(n = 30) {
  const dates = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDateString(d.getFullYear(), d.getMonth(), d.getDate());
    dates.push({
      dateStr,
      day: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      dayName: DAY_NAMES_SHORT[d.getDay()],
      dayLetter: DAY_LETTERS[d.getDay()]
    });
  }
  return dates;
}
