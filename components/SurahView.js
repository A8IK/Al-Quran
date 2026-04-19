"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import { nameToSlug } from "@/lib/slugs";
import surahs from "@/data/surahs.json";
import AyahCard from "./AyahCard";

function ArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ArrowRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function SurahView({ surah, prev, next }) {
  const { hydrated, settings } = useSettings();

  const arabicFont = {
    "king-fahad-v2": "var(--font-scheherazade)",
    "king-fahad-v1": "var(--font-amiri)",
    "qpc-utmani": "var(--font-naskh)",
  }[settings.arabicFont] || "var(--font-scheherazade)";

  // Scroll to #ayah-N if present in hash (after hydration to pick up dynamic sizing)
  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash && hash.startsWith("#ayah-")) {
      const el = document.querySelector(hash);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
    }
  }, [hydrated]);

  const showBismillah = surah.number !== 1 && surah.number !== 9;

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-sans text-sm text-ink-muted dark:text-cream-soft/70 hover:text-emerald-ink dark:hover:text-sage transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All surahs
        </Link>
      </div>

      {/* Surah header */}
      <header className="text-center mb-10 py-8 rounded-2xl bg-gradient-to-b from-parchment-50 to-parchment dark:from-night-card dark:to-night-soft border border-parchment-200/60 dark:border-night-card relative overflow-hidden">
        {/* Decorative corner flourishes */}
        <div className="absolute top-3 left-3 w-8 h-8 opacity-20">
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold w-full h-full">
            <path d="M2 2 Q2 16 16 16 M2 2 Q16 2 16 16" />
          </svg>
        </div>
        <div className="absolute top-3 right-3 w-8 h-8 opacity-20 scale-x-[-1]">
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold w-full h-full">
            <path d="M2 2 Q2 16 16 16 M2 2 Q16 2 16 16" />
          </svg>
        </div>
        <div className="absolute bottom-3 left-3 w-8 h-8 opacity-20 scale-y-[-1]">
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold w-full h-full">
            <path d="M2 2 Q2 16 16 16 M2 2 Q16 2 16 16" />
          </svg>
        </div>
        <div className="absolute bottom-3 right-3 w-8 h-8 opacity-20 scale-x-[-1] scale-y-[-1]">
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold w-full h-full">
            <path d="M2 2 Q2 16 16 16 M2 2 Q16 2 16 16" />
          </svg>
        </div>

        <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted dark:text-cream-soft/60 mb-3">
          Surah {surah.number}
        </p>
        <h1
          className="arabic text-4xl sm:text-5xl text-emerald-ink dark:text-sage mb-2 inline-block"
          style={{ fontFamily: arabicFont }}
        >
          {surah.nameArabic}
        </h1>
        <p className="font-serif text-2xl text-ink dark:text-cream">
          {surah.nameEnglish}
        </p>
        <p className="font-serif italic text-sm text-ink-muted dark:text-cream-soft/70 mt-1">
          {surah.translation}
        </p>
        <div className="mt-4 inline-flex items-center gap-3 text-xs font-sans text-ink-muted dark:text-cream-soft/60">
          <span>{surah.revelation}</span>
          <span className="w-1 h-1 rounded-full bg-ink-muted/40 dark:bg-cream-soft/30" />
          <span>{surah.ayahCount} verses</span>
        </div>
      </header>

      {/* Bismillah (all surahs except 1 and 9) */}
      {showBismillah && (
        <div className="text-center mb-8">
          <p
            className="arabic text-2xl sm:text-3xl text-emerald-ink dark:text-sage inline-block"
            style={{ fontFamily: arabicFont }}
          >
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>
      )}

      {/* Ayahs */}
      <ol className="space-y-3 sm:space-y-4">
        {surah.ayahs.map((ayah) => (
          <li key={ayah.number} id={`ayah-${ayah.number}`}>
            <AyahCard ayah={ayah} />
          </li>
        ))}
      </ol>

      {/* Prev/Next nav */}
      <nav className="mt-12 grid grid-cols-2 gap-3 sm:gap-4">
        {prev ? (
          <Link
            href={`/surah/${nameToSlug(prev.nameEnglish)}`}
            className="group p-4 rounded-xl bg-parchment-50 dark:bg-night-card hover:bg-parchment-100 dark:hover:bg-night-soft border border-parchment-200/60 dark:border-night-card hover:border-emerald-soft/30 dark:hover:border-sage/30 transition-all"
          >
            <div className="flex items-center gap-2 text-xs font-sans text-ink-muted dark:text-cream-soft/60 mb-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </div>
            <div className="font-serif text-sm text-ink dark:text-cream truncate">
              {prev.nameEnglish}
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/surah/${nameToSlug(next.nameEnglish)}`}
            className="group p-4 rounded-xl bg-parchment-50 dark:bg-night-card hover:bg-parchment-100 dark:hover:bg-night-soft border border-parchment-200/60 dark:border-night-card hover:border-emerald-soft/30 dark:hover:border-sage/30 transition-all text-right"
          >
            <div className="flex items-center justify-end gap-2 text-xs font-sans text-ink-muted dark:text-cream-soft/60 mb-1">
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="font-serif text-sm text-ink dark:text-cream truncate">
              {next.nameEnglish}
            </div>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
