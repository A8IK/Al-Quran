import surahs from '@/data/surahs.json';

/**
 * Convert Surah name to URL slug (lowercase with hyphens)
 * Example: "An-Nisaa" → "an-nisaa"
 */
export function nameToSlug(name) {
  return name.toLowerCase().replace(/['']/g, '').replace(/\s+/g, '-');
}

/**
 * Get Surah by slug
 * Example: "an-nisaa" → Surah 4
 */
export function getSurahBySlug(slug) {
  return surahs.find((s) => nameToSlug(s.nameEnglish) === slug);
}

/**
 * Get slug from Surah number
 */
export function getSlugFromNumber(number) {
  const surah = surahs.find((s) => s.number === Number(number));
  return surah ? nameToSlug(surah.nameEnglish) : null;
}

/**
 * Get all Surah slugs for static generation
 */
export function getAllSurahSlugs() {
  return surahs.map((s) => nameToSlug(s.nameEnglish));
}
