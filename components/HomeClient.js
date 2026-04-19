"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { searchAyahs } from "@/lib/api";
import { nameToSlug } from "@/lib/slugs";
import SurahCard from "./SurahCard";

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function highlight(text, query) {
  if (!query) return text;
  const terms = query
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!terms.length) return text;
  const re = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = text.split(re);
  return parts.map((p, i) =>
    re.test(p) ? (
      <mark
        key={i}
        className="bg-gold/25 dark:bg-gold/20 text-ink dark:text-cream rounded px-0.5"
      >
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default function HomeClient({ surahs }) {
  const { settings } = useSettings();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const inputRef = useRef(null);

  const arabicFont = {
    "king-fahad-v2": "var(--font-scheherazade)",
    "king-fahad-v1": "var(--font-amiri)",
    "qpc-utmani": "var(--font-naskh)",
  }[settings.arabicFont] || "var(--font-scheherazade)";

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 180);
    return () => clearTimeout(t);
  }, [query]);

  const filteredSurahs = useMemo(() => {
    const q = debounced.toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        s.nameEnglish.toLowerCase().includes(q) ||
        s.translation.toLowerCase().includes(q) ||
        String(s.number) === q
    );
  }, [debounced, surahs]);

  const ayahResults = useMemo(() => {
    if (debounced.length < 3) return [];
    return searchAyahs(debounced, 30);
  }, [debounced]);

  const inSearchMode = debounced.length >= 3;

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="text-center mb-10 pt-4">
        <p
          className="arabic text-4xl sm:text-5xl text-emerald-ink dark:text-sage mb-2 inline-block"
          style={{ fontFamily: arabicFont }}
          dir="rtl"
        >
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
        <p className="font-serif italic text-sm sm:text-base text-ink-muted dark:text-cream-soft/70">
          In the name of God, the Lord of Mercy, the Giver of Mercy
        </p>
      </section>

      {/* Search */}
      <div className="relative mb-8 max-w-2xl mx-auto">
        <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted dark:text-cream-soft/60" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search surahs or translations (e.g. mercy, patience, Al-Fatiha…)"
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-parchment-50 dark:bg-night-card border border-parchment-200 dark:border-night-card focus:border-emerald-soft dark:focus:border-sage focus:outline-none focus:ring-4 focus:ring-emerald-mist/60 dark:focus:ring-emerald-ink/20 font-sans text-sm sm:text-base placeholder:text-ink-muted/70 dark:placeholder:text-cream-soft/50 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-sans text-ink-muted dark:text-cream-soft/60 hover:text-emerald-ink dark:hover:text-sage"
          >
            Clear
          </button>
        )}
      </div>

      {/* Ayah search results */}
      {inSearchMode && (
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-serif text-xl text-emerald-ink dark:text-sage">
              Translation matches
            </h2>
            <span className="font-sans text-xs text-ink-muted dark:text-cream-soft/60">
              {ayahResults.length} result{ayahResults.length === 1 ? "" : "s"}
            </span>
          </div>
          {ayahResults.length === 0 ? (
            <p className="font-serif italic text-ink-muted dark:text-cream-soft/70 py-6 text-center">
              No translation matches found.
            </p>
          ) : (
            <ul className="space-y-3">
              {ayahResults.map((r) => (
                <li key={`${r.surahNumber}:${r.ayahNumber}`}>
                  <Link
                    href={`/surah/${nameToSlug(r.surahNameEnglish)}#ayah-${r.ayahNumber}`}
                    className="block p-4 sm:p-5 rounded-xl bg-parchment-50 dark:bg-night-card hover:bg-parchment-100 dark:hover:bg-night-soft border border-parchment-200/60 dark:border-night-card hover:border-emerald-soft/30 dark:hover:border-sage/30 transition-all group"
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="font-sans text-xs text-emerald-ink dark:text-sage">
                        {r.surahNameEnglish} · {r.surahNumber}:{r.ayahNumber}
                      </span>
                      <span
                        className="arabic text-base text-ink-muted dark:text-cream-soft/70"
                        style={{ fontFamily: arabicFont }}
                      >
                        {r.surahNameArabic}
                      </span>
                    </div>
                    <p className="font-serif text-sm sm:text-base text-ink-soft dark:text-cream-soft leading-relaxed">
                      {highlight(r.english, debounced)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Surah grid */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-serif text-xl text-emerald-ink dark:text-sage">
            {inSearchMode ? "Matching surahs" : "All 114 Surahs"}
          </h2>
          {inSearchMode && (
            <span className="font-sans text-xs text-ink-muted dark:text-cream-soft/60">
              {filteredSurahs.length} match
              {filteredSurahs.length === 1 ? "" : "es"}
            </span>
          )}
        </div>

        {filteredSurahs.length === 0 ? (
          <p className="font-serif italic text-ink-muted dark:text-cream-soft/70 py-6 text-center">
            No surahs match your query.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredSurahs.map((s) => (
              <li key={s.number}>
                <SurahCard surah={s} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
