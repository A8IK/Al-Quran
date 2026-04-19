const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Import local data as fallback
import surahsData from '@/data/surahs.json';
import quranData from '@/data/quran.json';

/**
 * Fetch all Surahs
 */
export async function getAllSurahs() {
  try {
    const response = await fetch(`${API_URL}/api/surahs`, { cache: 'force-cache' });
    if (!response.ok) throw new Error('Failed to fetch surahs');
    return await response.json();
  } catch (error) {
    console.warn('API fetch failed, using local data:', error.message);
    return surahsData;
  }
}

/**
 * Fetch specific Surah with all verses
 */
export async function getSurah(id) {
  try {
    const response = await fetch(`${API_URL}/api/surah/${id}`, { cache: 'force-cache' });
    if (!response.ok) throw new Error('Failed to fetch surah');
    return await response.json();
  } catch (error) {
    console.warn(`API fetch failed for surah ${id}, using local data:`, error.message);
    // Fallback to local data
    return quranData.surahs?.find((s) => s.number === Number(id)) || null;
  }
}

/**
 * Get all Surah numbers for static generation
 */
export async function getAllSurahNumbers() {
  try {
    const surahs = await getAllSurahs();
    return surahs.map((s) => s.number);
  } catch (error) {
    console.warn('Error fetching surah numbers, using local data:', error.message);
    return surahsData.map((s) => s.number);
  }
}

/**
 * Search verses by query
 */
export async function searchAyahs(query, limit = 50) {
  try {
    const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}&limit=${limit}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Search failed');
    return await response.json();
  } catch (error) {
    console.warn('API search failed, using local search:', error.message);
    // Fallback to local search
    if (!query || query.length < 2) return [];
    
    const results = [];
    const q = query.toLowerCase();
    for (const surah of quranData.surahs || []) {
      for (const ayah of surah.ayahs || []) {
        if (ayah.english?.toLowerCase().includes(q) || 
            ayah.arabic?.includes(query) || 
            String(ayah.number) === query) {
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
}

/**
 * Get specific Ayah
 */
export async function getAyah(surahId, ayahNumber) {
  try {
    const response = await fetch(`${API_URL}/api/surah/${surahId}/ayah/${ayahNumber}`, { cache: 'force-cache' });
    if (!response.ok) throw new Error('Failed to fetch ayah');
    return await response.json();
  } catch (error) {
    console.warn(`API fetch failed for ayah ${surahId}:${ayahNumber}, using local data:`, error.message);
    // Fallback to local data
    const surah = quranData.surahs?.find((s) => s.number === Number(surahId));
    if (!surah) return null;
    const ayah = surah.ayahs?.find((a) => a.number === Number(ayahNumber));
    return ayah ? {
      surahNumber: surah.number,
      surahNameEnglish: surah.nameEnglish,
      ayahNumber: ayah.number,
      arabic: ayah.arabic,
      english: ayah.english,
    } : null;
  }
}

/**
 * Get all verses in a specific Juz
 */
export async function getJuz(juzNumber) {
  try {
    const response = await fetch(`${API_URL}/api/juz/${juzNumber}`, { cache: 'force-cache' });
    if (!response.ok) throw new Error('Failed to fetch juz');
    return await response.json();
  } catch (error) {
    console.warn(`API fetch failed for juz ${juzNumber}, using local data:`, error.message);
    // Fallback - return empty verses (Juz filtering is complex without server)
    return { juz: juzNumber, verses: [] };
  }
}

/**
 * Health check
 */
export async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_URL}/api/health`, { cache: 'no-store' });
    if (!response.ok) throw new Error('API health check failed');
    return await response.json();
  } catch (error) {
    console.warn('API health check failed:', error.message);
    return { status: 'OFFLINE', message: 'Using local data', surahs: quranData.surahs?.length || 0 };
  }
}
