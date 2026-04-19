"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import surahs from "@/data/surahs.json";
import quranData from "@/data/quran.json";
import { searchAyahs } from "@/lib/quran";

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <path d="M6 6l12 12M18 6l-6 12" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useSettings();
  const [surahSearch, setSurahSearch] = useState("");
  const [verseSearch, setVerseSearch] = useState("");
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [selectedJuz, setSelectedJuz] = useState(null);
  const [filterType, setFilterType] = useState("surah"); // "surah", "verse", "juz"
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Detect screen size on mount and window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const arabicFont = {
    "king-fahad-v2": "var(--font-scheherazade)",
    "king-fahad-v1": "var(--font-amiri)",
    "qpc-utmani": "var(--font-naskh)",
  }[settings.arabicFont] || "var(--font-scheherazade)";

  // Juz boundaries (start and end surah:ayah)
  const juzBoundaries = [
    { juz: 1, startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141 },
    { juz: 2, startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252 },
    { juz: 3, startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 91 },
    { juz: 4, startSurah: 3, startAyah: 92, endSurah: 4, endAyah: 23 },
    { juz: 5, startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147 },
    { juz: 6, startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81 },
    { juz: 7, startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110 },
    { juz: 8, startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87 },
    { juz: 9, startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40 },
    { juz: 10, startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92 },
    { juz: 11, startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5 },
    { juz: 12, startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52 },
    { juz: 13, startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52 },
    { juz: 14, startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128 },
    { juz: 15, startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74 },
    { juz: 16, startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135 },
    { juz: 17, startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78 },
    { juz: 18, startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20 },
    { juz: 19, startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55 },
    { juz: 20, startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45 },
    { juz: 21, startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30 },
    { juz: 22, startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27 },
    { juz: 23, startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31 },
    { juz: 24, startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46 },
    { juz: 25, startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37 },
    { juz: 26, startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30 },
    { juz: 27, startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29 },
    { juz: 28, startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12 },
    { juz: 29, startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50 },
    { juz: 30, startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6 },
  ];

  const getVersesForJuz = useMemo(() => {
    if (!selectedJuz) return [];
    const boundary = juzBoundaries.find((b) => b.juz === selectedJuz);
    if (!boundary) return [];

    const verses = [];
    for (let surahNum = boundary.startSurah; surahNum <= boundary.endSurah; surahNum++) {
      const surah = quranData.surahs.find((s) => s.number === surahNum);
      if (!surah) continue;

      const startAyah = surahNum === boundary.startSurah ? boundary.startAyah : 1;
      const endAyah = surahNum === boundary.endSurah ? boundary.endAyah : surah.ayahs.length;

      for (let i = startAyah - 1; i < endAyah; i++) {
        if (surah.ayahs[i]) {
          verses.push({
            ...surah.ayahs[i],
            surahNumber: surahNum,
            surahName: surah.nameEnglish,
          });
        }
      }
    }

    return verses.filter((v) => {
      if (!verseSearch.trim()) return true;
      const q = verseSearch.trim().toLowerCase();
      return (
        v.english.toLowerCase().includes(q) ||
        v.arabic.includes(verseSearch) ||
        String(v.number).includes(q)
      );
    });
  }, [selectedJuz, verseSearch]);

  useEffect(() => {
    onClose?.();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredSurahs = useMemo(() => {
    const q = surahSearch.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        s.nameEnglish.toLowerCase().includes(q) ||
        s.translation.toLowerCase().includes(q) ||
        String(s.number) === q
    );
  }, [surahSearch]);

  const selectedSurahData = useMemo(() => {
    if (!selectedSurah) return null;
    return quranData.surahs.find((s) => s.number === selectedSurah);
  }, [selectedSurah]);

  const filteredVerses = useMemo(() => {
    if (!selectedSurahData) return [];
    const q = verseSearch.trim().toLowerCase();
    if (!q) return selectedSurahData.ayahs;
    return selectedSurahData.ayahs.filter(
      (ayah) =>
        String(ayah.number).includes(q) ||
        ayah.english.toLowerCase().includes(q) ||
        ayah.arabic.includes(verseSearch)
    );
  }, [selectedSurahData, verseSearch]);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-ink/30 dark:bg-night/70 z-40 backdrop-blur-sm"
        />
      )}

      <aside
        className="fixed top-0 z-50 h-full bg-parchment-50 dark:bg-night-soft
          border-r border-parchment-200 dark:border-night-card
          flex flex-col
          transition-all duration-300 ease-out
          w-full sm:w-96 lg:w-80"
        style={{
          left: isLargeScreen ? '0' : (open ? '0' : '-100%')
        }}
        data-open={open}
      >
        {/* Header with tabs */}
        <div className="px-4 py-3 border-b border-parchment-200 dark:border-night-card shrink-0">
          {/* Filter type tabs */}
          <div className="flex items-center gap-2 mb-3 bg-parchment dark:bg-night-card rounded-full p-1">
            {["surah", "verse", "juz"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 py-1 px-3 rounded-full text-xs font-sans transition-colors capitalize ${
                  filterType === type
                    ? "bg-emerald-ink text-parchment dark:bg-sage dark:text-night"
                    : "text-ink-muted dark:text-cream-soft/70 hover:text-ink-soft dark:hover:text-cream-soft"
                }`}
              >
                {type}
              </button>
            ))}
            <button
              onClick={onClose}
              className="ml-auto lg:hidden p-1 rounded hover:bg-parchment-100 dark:hover:bg-night text-ink-soft dark:text-cream-soft"
              aria-label="Close"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Tip message */}
          <div className="text-[11px] text-ink-muted dark:text-cream-soft/60 italic flex items-center gap-2">
            <span>Tip: try navigating with</span>
            <kbd className="px-2 py-0.5 rounded border border-parchment-200 dark:border-night-card bg-parchment dark:bg-night-card text-[10px]">
              ctrl K
            </kbd>
          </div>
        </div>

        {/* Search inputs - show based on active filter */}
        {filterType === "surah" && (
          <div className="px-4 py-3 shrink-0 border-b border-parchment-200 dark:border-night-card">
            <div className="relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-cream-soft/60" />
              <input
                type="text"
                value={surahSearch}
                onChange={(e) => {
                  setSurahSearch(e.target.value);
                  if (!selectedSurah && filteredSurahs.length > 0) {
                    setSelectedSurah(filteredSurahs[0].number);
                  }
                }}
                placeholder="Search Surah"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-parchment dark:bg-night-card border border-parchment-200 dark:border-night-card focus:border-emerald-soft dark:focus:border-sage focus:outline-none font-sans"
              />
            </div>
          </div>
        )}

        {filterType === "verse" && (
          <div className="px-4 py-3 flex gap-2 shrink-0 border-b border-parchment-200 dark:border-night-card">
            <div className="flex-1 relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-cream-soft/60" />
              <input
                type="text"
                value={surahSearch}
                onChange={(e) => {
                  setSurahSearch(e.target.value);
                  if (!selectedSurah && filteredSurahs.length > 0) {
                    setSelectedSurah(filteredSurahs[0].number);
                  }
                }}
                placeholder="Search Surah"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-parchment dark:bg-night-card border border-parchment-200 dark:border-night-card focus:border-emerald-soft dark:focus:border-sage focus:outline-none font-sans"
              />
            </div>
            <div className="flex-1 relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-cream-soft/60" />
              <input
                type="text"
                value={verseSearch}
                onChange={(e) => setVerseSearch(e.target.value)}
                placeholder="Search Verses"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-parchment dark:bg-night-card border border-parchment-200 dark:border-night-card focus:border-emerald-soft dark:focus:border-sage focus:outline-none font-sans"
              />
            </div>
          </div>
        )}

        {filterType === "juz" && (
          <div className="px-4 py-3 flex gap-2 shrink-0 border-b border-parchment-200 dark:border-night-card">
            <div className="flex-1 relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-cream-soft/60" />
              <input
                type="text"
                value={verseSearch}
                onChange={(e) => setVerseSearch(e.target.value)}
                placeholder="Search Verses"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-parchment dark:bg-night-card border border-parchment-200 dark:border-night-card focus:border-emerald-soft dark:focus:border-sage focus:outline-none font-sans"
              />
            </div>
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {/* Surah Tab - Full width */}
          {filterType === "surah" && (
            <div className="h-full overflow-y-auto">
              <nav className="divide-y divide-parchment-100 dark:divide-night-card">
                {filteredSurahs.map((s) => (
                  <button
                    key={s.number}
                    onClick={() => {
                      router.push(`/surah/${s.number}`);
                      onClose?.();
                    }}
                    className={`w-full text-left px-4 py-3 transition-colors text-sm ${
                      selectedSurah === s.number
                        ? "bg-emerald-mist dark:bg-emerald-ink/20 text-emerald-deep dark:text-sage font-semibold border-l-4 border-emerald-ink dark:border-sage"
                        : "hover:bg-parchment-100 dark:hover:bg-night-card text-ink dark:text-cream"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-xs shrink-0">{s.number}</span>
                      <span className="text-xs font-sans text-ink-muted dark:text-cream-soft/70 break-words">
                        {s.nameEnglish}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>
              {filteredSurahs.length === 0 && (
                <p className="text-center text-xs text-ink-muted dark:text-cream-soft/60 py-8">
                  No surahs match
                </p>
              )}
            </div>
          )}

          {/* Verse Tab - Split view with Surahs on left and Verses on right */}
          {filterType === "verse" && (
            <div className="h-full flex overflow-hidden">
              {/* Left panel - Surahs */}
              <div className="w-2/5 border-r border-parchment-200 dark:border-night-card overflow-y-auto">
                <nav className="divide-y divide-parchment-100 dark:divide-night-card">
                  {filteredSurahs.map((s) => (
                    <button
                      key={s.number}
                      onClick={() => setSelectedSurah(s.number)}
                      className={`w-full text-left px-3 py-3 transition-colors text-sm ${
                        selectedSurah === s.number
                          ? "bg-emerald-mist dark:bg-emerald-ink/20 text-emerald-deep dark:text-sage font-semibold border-l-4 border-emerald-ink dark:border-sage"
                          : "hover:bg-parchment-100 dark:hover:bg-night-card text-ink dark:text-cream"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-xs shrink-0">{s.number}</span>
                        <span className="text-xs font-sans text-ink-muted dark:text-cream-soft/70 break-words">
                          {s.nameEnglish}
                        </span>
                      </div>
                    </button>
                  ))}
                </nav>
                {filteredSurahs.length === 0 && (
                  <p className="text-center text-xs text-ink-muted dark:text-cream-soft/60 py-8">
                    No surahs match
                  </p>
                )}
              </div>

              {/* Right panel - Verses */}
              <div className="w-3/5 overflow-y-auto">
                {selectedSurahData ? (
                  <nav className="divide-y divide-parchment-100 dark:divide-night-card">
                    {filteredVerses.map((ayah) => (
                      <Link
                        key={ayah.number}
                        href={`/surah/${selectedSurahData.number}#ayah-${ayah.number}`}
                        onClick={onClose}
                        className="block px-4 py-3 transition-colors hover:bg-parchment-100 dark:hover:bg-night-card text-sm border-l-4 border-transparent hover:border-emerald-soft dark:hover:border-sage"
                      >
                        <div className="text-xs font-sans text-ink-muted dark:text-cream-soft/70 mb-1">
                          Verse {ayah.number}
                        </div>
                        <p
                          className="text-xs font-serif leading-relaxed text-ink dark:text-cream line-clamp-2"
                          style={{ fontFamily: arabicFont }}
                        >
                          {ayah.arabic}
                        </p>
                        <p className="text-[10px] font-sans text-ink-muted dark:text-cream-soft/60 line-clamp-1 mt-1">
                          {ayah.english}
                        </p>
                      </Link>
                    ))}
                  </nav>
                ) : (
                  <p className="text-center text-xs text-ink-muted dark:text-cream-soft/60 py-8">
                    Select a surah
                  </p>
                )}
                {selectedSurahData && filteredVerses.length === 0 && verseSearch && (
                  <p className="text-center text-xs text-ink-muted dark:text-cream-soft/60 py-8">
                    No verses match
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Juz Tab - Split view with Juz list on left and Verses on right */}
          {filterType === "juz" && (
            <div className="h-full flex overflow-hidden">
              {/* Left panel - Juz List */}
              <div className="w-2/5 border-r border-parchment-200 dark:border-night-card overflow-y-auto">
                <nav className="divide-y divide-parchment-100 dark:divide-night-card">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => (
                    <button
                      key={juzNum}
                      onClick={() => setSelectedJuz(juzNum)}
                      className={`w-full text-left px-4 py-3 transition-colors text-sm ${
                        selectedJuz === juzNum
                          ? "bg-emerald-mist dark:bg-emerald-ink/20 text-emerald-deep dark:text-sage font-semibold border-l-4 border-emerald-ink dark:border-sage"
                          : "hover:bg-parchment-100 dark:hover:bg-night-card text-ink dark:text-cream"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-serif">{juzNum}</span>
                        <span className="text-xs font-sans text-ink-muted dark:text-cream-soft/70">
                          Juz {juzNum}
                        </span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Right panel - Verses from Juz */}
              <div className="w-3/5 overflow-y-auto">
                {selectedJuz ? (
                  <nav className="divide-y divide-parchment-100 dark:divide-night-card">
                    {getVersesForJuz.map((ayah) => (
                      <Link
                        key={`${ayah.surahNumber}-${ayah.number}`}
                        href={`/surah/${ayah.surahNumber}#ayah-${ayah.number}`}
                        onClick={onClose}
                        className="block px-4 py-3 transition-colors hover:bg-parchment-100 dark:hover:bg-night-card text-sm border-l-4 border-transparent hover:border-emerald-soft dark:hover:border-sage"
                      >
                        <div className="text-xs font-sans text-ink-muted dark:text-cream-soft/70 mb-1">
                          {ayah.surahName} · Verse {ayah.number}
                        </div>
                        <p
                          className="text-xs font-serif leading-relaxed text-ink dark:text-cream line-clamp-2"
                          style={{ fontFamily: arabicFont }}
                        >
                          {ayah.arabic}
                        </p>
                        <p className="text-[10px] font-sans text-ink-muted dark:text-cream-soft/60 line-clamp-1 mt-1">
                          {ayah.english}
                        </p>
                      </Link>
                    ))}
                  </nav>
                ) : (
                  <p className="text-center text-xs text-ink-muted dark:text-cream-soft/60 py-8">
                    Select a Juz
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
