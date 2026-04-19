import quranData from "@/data/quran.json";
import surahIndex from "@/data/surahs.json";

export function getAllSurahs() {
  return surahIndex;
}

export function getSurah(id) {
  const n = Number(id);
  return quranData.surahs.find((s) => s.number === n) || null;
}

// Strips Arabic diacritics and punctuation for loose matching
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Client-safe search across all ayah translations.
// Returns up to `limit` results with surah context.
export function searchAyahs(query, limit = 50) {
  const q = normalize(query);
  if (q.length < 2) return [];

  const terms = q.split(" ").filter(Boolean);
  const results = [];

  for (const surah of quranData.surahs) {
    for (const ayah of surah.ayahs) {
      const hay = normalize(ayah.english);
      if (terms.every((t) => hay.includes(t))) {
        results.push({
          surahNumber: surah.number,
          surahNameEnglish: surah.nameEnglish,
          surahNameArabic: surah.nameArabic,
          ayahNumber: ayah.number,
          arabic: ayah.arabic,
          english: ayah.english,
        });
        if (results.length >= limit) return results;
      }
    }
  }
  return results;
}

export function getAllSurahNumbers() {
  return surahIndex.map((s) => String(s.number));
}
