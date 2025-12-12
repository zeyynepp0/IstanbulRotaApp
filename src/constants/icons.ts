export const ICONS = {
  start: "🚩",
  destination: "🎯",
  swap: "⇅",
  car: "🚗",
  transit: "🚇",
  train: "🚆",
  park: "🅿️",
  time: "⏱️",
  bulb: "💡",
  warning: "⚠️",
  traffic: "🚦",
  back: "←",
  arrowRight: "→",
  walk: "🚶",
  walkFemale: "🚶‍♀️",
  pin: "📍",
  clear: "×",
  flash: "⚡",
  info: "ℹ️"
} as const;

export type IconName = keyof typeof ICONS;