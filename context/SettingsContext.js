"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "quran-settings";

const DEFAULTS = {
  arabicFont: "king-fahad-v2",
  arabicSize: 32,
  translationSize: 16,
  darkMode: false,
  showTranslation: true,
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULTS, ...parsed });
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings, hydrated]);

  const update = (patch) => setSettings((prev) => ({ ...prev, ...patch }));
  const reset = () => setSettings(DEFAULTS);

  return (
    <SettingsContext.Provider value={{ settings, update, reset, hydrated }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

export const ARABIC_FONTS = [
  { id: "king-fahad-v2", label: "King Fahad Complex v2", cssVar: "var(--font-scheherazade)" },
  { id: "king-fahad-v1", label: "King Fahad Complex v1", cssVar: "var(--font-amiri)" },
  { id: "qpc-utmani", label: "Qpc Utmani Hafs", cssVar: "var(--font-naskh)" },
];
