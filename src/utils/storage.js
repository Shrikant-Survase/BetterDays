/**
 * Storage utility with error handling, JSON export, and backup restoration.
 */

const STORAGE_KEYS = {
  HABITS: "betterdays_habits",
  RECORDS: "betterdays_records",
  PROFILE: "betterdays_profile",
  VERSION: "betterdays_version"
};

const CURRENT_VERSION = "1.0.0";

export function loadFromStorage(key, defaultValue) {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error loading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

export function saveToStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error);
  }
}

export function clearAllStorage() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.HABITS);
    window.localStorage.removeItem(STORAGE_KEYS.RECORDS);
    window.localStorage.removeItem(STORAGE_KEYS.PROFILE);
    window.localStorage.removeItem(STORAGE_KEYS.VERSION);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

/**
 * Generates and triggers download of a JSON backup file
 */
export function exportBackup(habits, records, profile) {
  const backupData = {
    app: "BetterDays",
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    profile,
    habits,
    records
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(backupData, null, 2)
  )}`;
  const downloadAnchor = document.createElement("a");
  const dateTag = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute("href", jsonString);
  downloadAnchor.setAttribute("download", `betterdays-backup-${dateTag}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Validates imported JSON structure
 */
export function validateBackup(data) {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Invalid JSON file. Expected an object." };
  }

  if (!Array.isArray(data.habits)) {
    return { valid: false, error: "Invalid backup format: 'habits' list is missing." };
  }

  if (!data.records || typeof data.records !== "object") {
    return { valid: false, error: "Invalid backup format: 'records' map is missing." };
  }

  return { valid: true, error: null };
}

export { STORAGE_KEYS, CURRENT_VERSION };
