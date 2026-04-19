import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

export default function SurahCard({ surah }) {
  const { settings } = useSettings();

  const arabicFont = {
    "king-fahad-v2": "var(--font-scheherazade)",
    "king-fahad-v1": "var(--font-amiri)",
    "qpc-utmani": "var(--font-naskh)",
  }[settings.arabicFont] || "var(--font-scheherazade)";
  return (
    <Link
      href={`/surah/${surah.number}`}
      className="group block h-full p-4 sm:p-5 rounded-2xl bg-parchment-50 dark:bg-night-card border border-parchment-200/50 dark:border-night-card hover:border-emerald-soft/40 dark:hover:border-sage/40 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Rosette number badge */}
          <div className="relative shrink-0">
            <svg
              viewBox="0 0 48 48"
              className="w-10 h-10 text-gold/70 group-hover:text-gold transition-colors"
              fill="currentColor"
            >
              <path d="M24 2l4 5 6-2 1 6 6 1-2 6 5 4-5 4 2 6-6 1-1 6-6-2-4 5-4-5-6 2-1-6-6-1 2-6-5-4 5-4-2-6 6-1 1-6 6 2z" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-sans text-[11px] font-medium text-parchment dark:text-night">
              {surah.number}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-base text-ink dark:text-cream truncate">
              {surah.nameEnglish}
            </h3>
            <p className="font-sans text-xs text-ink-muted dark:text-cream-soft/70 truncate">
              {surah.translation}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div
            className="arabic text-xl text-emerald-ink dark:text-sage group-hover:text-emerald-deep dark:group-hover:text-sage transition-colors"
            style={{ fontFamily: arabicFont }}
          >
            {surah.nameArabic}
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-parchment-200/60 dark:border-night-soft flex items-center justify-between text-[11px] font-sans">
        <span className="text-ink-muted dark:text-cream-soft/60">
          {surah.revelation}
        </span>
        <span className="text-ink-muted dark:text-cream-soft/60">
          {surah.ayahCount} verses
        </span>
      </div>
    </Link>
  );
}
