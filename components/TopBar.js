"use client";

import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
    </svg>
  );
}

function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
    </svg>
  );
}

export default function TopBar({ onMenuClick, onSettingsClick }) {
  const { settings, update } = useSettings();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-parchment/80 dark:bg-night/80 border-b border-parchment-200/70 dark:border-night-card">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-16 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-parchment-100 dark:hover:bg-night-card text-ink-soft dark:text-cream-soft transition-colors"
            aria-label="Toggle navigation"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <Link
            href="/"
            className="font-serif text-lg tracking-tight text-emerald-ink dark:text-sage hover:opacity-80 transition-opacity"
          >
            القرآن
            <span className="ml-2 font-sans text-sm text-ink-muted dark:text-cream-soft/70">
              · Quran
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => update({ darkMode: !settings.darkMode })}
            className="p-2 rounded-lg hover:bg-parchment-100 dark:hover:bg-night-card text-ink-soft dark:text-cream-soft transition-colors"
            aria-label="Toggle theme"
          >
            {settings.darkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-lg hover:bg-parchment-100 dark:hover:bg-night-card text-ink-soft dark:text-cream-soft transition-colors"
            aria-label="Open settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
