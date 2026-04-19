import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load Quran data
const quranDataPath = join(__dirname, '../data/quran.json');
const surahsDataPath = join(__dirname, '../data/surahs.json');

let quranData = {};
let surahsData = [];

try {
  quranData = JSON.parse(readFileSync(quranDataPath, 'utf8'));
  surahsData = JSON.parse(readFileSync(surahsDataPath, 'utf8'));
  console.log(`✓ Loaded ${quranData.surahs?.length || 0} surahs with data`);
} catch (error) {
  console.error('Error loading Quran data:', error.message);
}

// API Routes

// Get all Surahs
app.get('/api/surahs', (req, res) => {
  try {
    res.json(surahsData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch surahs' });
  }
});

// Get specific Surah with all verses
app.get('/api/surah/:id', (req, res) => {
  try {
    const surahId = Number(req.params.id);
    const surah = quranData.surahs?.find((s) => s.number === surahId);
    
    if (!surah) {
      return res.status(404).json({ error: 'Surah not found' });
    }
    
    res.json(surah);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch surah' });
  }
});

// Search verses
app.get('/api/search', (req, res) => {
  try {
    const query = req.query.q?.toString().toLowerCase().trim();
    
    if (!query || query.length < 2) {
      return res.json([]);
    }
    
    const results = [];
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    
    for (const surah of quranData.surahs || []) {
      for (const ayah of surah.ayahs || []) {
        const englishMatch = ayah.english?.toLowerCase().includes(query);
        const arabicMatch = ayah.arabic?.includes(query);
        const numberMatch = String(ayah.number) === query;
        
        if (englishMatch || arabicMatch || numberMatch) {
          results.push({
            surahNumber: surah.number,
            surahNameEnglish: surah.nameEnglish,
            surahNameArabic: surah.nameArabic,
            ayahNumber: ayah.number,
            arabic: ayah.arabic,
            english: ayah.english,
          });
          
          if (results.length >= limit) {
            return res.json(results);
          }
        }
      }
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get specific verse by Surah and Ayah number
app.get('/api/surah/:surahId/ayah/:ayahNumber', (req, res) => {
  try {
    const surahId = Number(req.params.surahId);
    const ayahNumber = Number(req.params.ayahNumber);
    
    const surah = quranData.surahs?.find((s) => s.number === surahId);
    if (!surah) {
      return res.status(404).json({ error: 'Surah not found' });
    }
    
    const ayah = surah.ayahs?.find((a) => a.number === ayahNumber);
    if (!ayah) {
      return res.status(404).json({ error: 'Ayah not found' });
    }
    
    res.json({
      surahNumber: surah.number,
      surahNameEnglish: surah.nameEnglish,
      ayahNumber: ayah.number,
      arabic: ayah.arabic,
      english: ayah.english,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ayah' });
  }
});

// Get verses for a specific Juz
app.get('/api/juz/:juzNumber', (req, res) => {
  try {
    const juzNumber = Number(req.params.juzNumber);
    
    if (juzNumber < 1 || juzNumber > 30) {
      return res.status(400).json({ error: 'Juz number must be between 1 and 30' });
    }
    
    // Juz boundaries
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
    
    const boundary = juzBoundaries.find((b) => b.juz === juzNumber);
    if (!boundary) {
      return res.status(404).json({ error: 'Juz not found' });
    }
    
    const verses = [];
    for (const surah of quranData.surahs || []) {
      if (surah.number < boundary.startSurah || surah.number > boundary.endSurah) {
        continue;
      }
      
      for (const ayah of surah.ayahs || []) {
        let isInRange = false;
        
        if (surah.number === boundary.startSurah && surah.number === boundary.endSurah) {
          isInRange = ayah.number >= boundary.startAyah && ayah.number <= boundary.endAyah;
        } else if (surah.number === boundary.startSurah) {
          isInRange = ayah.number >= boundary.startAyah;
        } else if (surah.number === boundary.endSurah) {
          isInRange = ayah.number <= boundary.endAyah;
        } else {
          isInRange = true;
        }
        
        if (isInRange) {
          verses.push({
            surahNumber: surah.number,
            surahNameEnglish: surah.nameEnglish,
            surahNameArabic: surah.nameArabic,
            ayahNumber: ayah.number,
            arabic: ayah.arabic,
            english: ayah.english,
          });
        }
      }
    }
    
    res.json({ juz: juzNumber, verses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch juz' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Quran API is running',
    surahs: quranData.surahs?.length || 0,
    totalVerses: quranData.surahs?.reduce((sum, s) => sum + (s.ayahs?.length || 0), 0) || 0,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Quran API Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api/health\n`);
});
