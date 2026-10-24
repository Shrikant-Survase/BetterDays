/**
 * Default habits inspired by the reference paper tracker:
 * Features the exact 14 habits from the reference photo,
 * categorized with appropriate icons.
 */

export const DEFAULT_HABITS = [
  {
    id: "habit_1",
    name: "6hr sleep",
    category: "Health",
    icon: "Moon",
    color: "#2D5A43",
    frequency: "daily",
    customDays: [0, 1, 2, 3, 4, 5, 6],
    order: 1,
    archived: false,
    createdAt: "2026-10-01"
  },
  {
    id: "habit_2",
    name: "Workout",
    category: "Fitness",
    icon: "Dumbbell",
    color: "#2D5A43",
    frequency: "daily",
    customDays: [0, 1, 2, 3, 4, 5, 6],
    order: 2,
    archived: false,
    createdAt: "2026-10-01"
  },
  {
    id: "habit_3",
    name: "Praying",
    category: "Mindfulness",
    icon: "Sparkles",
    color: "#2D5A43",
    frequency: "daily",
    customDays: [0, 1, 2, 3, 4, 5, 6],
    order: 3,
    archived: false,
    createdAt: "2026-10-01"
  },
  {
    id: "habit_4",
    name: "Chanting 16 mala",
    category: "Mindfulness",
    icon: "Flame",
    color: "#2D5A43",
    frequency: "daily",
    customDays: [0, 1, 2, 3, 4, 5, 6],
    order: 4,
    archived: false,
    createdAt: "2026-10-01"
  },
  {
    id: "habit_5",
    name: "Drink 3L Water",
    category: "Health",
    icon: "Droplets",
    color: "#2D5A43",
    frequency: "daily",
    customDays: [0, 1, 2, 3, 4, 5, 6],
    order: 5,
    archived: false,
    createdAt: "2026-10-01"
  },
  {
    id: "habit_6",
    name: "Spiritual Discourse",
    category: "Mindfulness",
    icon: "Headphones",
    color: "#2D5A43",
    frequency: "daily",
    customDays: [0, 1, 2, 3, 4, 5, 6],
    order: 6,
    archived: false,
    createdAt: "2026-10-01"
  },
  {
    id: "habit_7",
    name: "10k Naam jup",
    category: "Mindfulness",
    icon: "Heart",
    color: "#2D5A43",
    frequency: "daily",
    customDays: [0, 1, 2, 3, 4, 5, 6],
    order: 7,
    archived: false,
    createdAt: "2026-10-01"
  },
  {
    id: "habit_8",
    name: "Book Read",
    category: "Learning",
    icon: "BookOpen",
    color: "#2D5A43",
    frequency: "daily",
    customDays: [0, 1, 2, 3, 4, 5, 6],
    order: 8,
    archived: false,
    createdAt: "2026-10-01"
  },
  {
    id: "habit_9",
    name: "Learn SMM Skill",
    category: "Growth",
    icon: "TrendingUp",
    color: "#2D5A43",
    frequency: "daily",
    customDays: [0, 1, 2, 3, 4, 5, 6],
    order: 9,
    archived: false,
    createdAt: "2026-10-01"
  },
  {
    id: "habit_10",
    name: "Create Content & post",
    category: "Growth",
    icon: "Send",
    color: "#2D5A43",
    frequency: "daily",
    customDays: [0, 1, 2, 3, 4, 5, 6],
    order: 10,
    archived: false,
    createdAt: "2026-10-01"
  },
  {
    id: "habit_11",
    name: "Learn English speaking",
    category: "Learning",
    icon: "MessageSquare",
    color: "#2D5A43",
    frequency: "daily",
    customDays: [0, 1, 2, 3, 4, 5, 6],
    order: 11,
    archived: false,
    createdAt: "2026-10-01"
  },
  {
    id: "habit_12",
    name: "Journal",
    category: "Reflection",
    icon: "PenTool",
    color: "#2D5A43",
    frequency: "daily",
    customDays: [0, 1, 2, 3, 4, 5, 6],
    order: 12,
    archived: false,
    createdAt: "2026-10-01"
  },
  {
    id: "habit_13",
    name: "Do Your Own Work & Help Others",
    category: "Routine",
    icon: "Users",
    color: "#2D5A43",
    frequency: "daily",
    customDays: [0, 1, 2, 3, 4, 5, 6],
    order: 13,
    archived: false,
    createdAt: "2026-10-01"
  },
  {
    id: "habit_14",
    name: "Sleep Before 10 PM",
    category: "Health",
    icon: "Clock",
    color: "#2D5A43",
    frequency: "daily",
    customDays: [0, 1, 2, 3, 4, 5, 6],
    order: 14,
    archived: false,
    createdAt: "2026-10-01"
  }
];

export const CATEGORIES = [
  "All",
  "Health",
  "Fitness",
  "Mindfulness",
  "Learning",
  "Growth",
  "Reflection",
  "Routine"
];

export const AVAILABLE_ICONS = [
  "Moon", "Dumbbell", "Sparkles", "Flame", "Droplets", "Headphones",
  "Heart", "BookOpen", "TrendingUp", "Send", "MessageSquare", "PenTool",
  "Users", "Clock", "CheckCircle", "Coffee", "Smile", "Sun", "Target",
  "Zap", "Compass", "Feather", "Award", "Shield"
];

export const DEFAULT_PROFILE = {
  name: "shrikant",
  tagline: "Becoming Better",
  creatorHandle: "@shrikantyadav0"
};
