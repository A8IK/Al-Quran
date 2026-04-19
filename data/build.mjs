import { readFileSync, writeFileSync } from "node:fs";

const ar = JSON.parse(readFileSync("./ar.json", "utf8"));
const en = JSON.parse(readFileSync("./en.json", "utf8"));

const arSurahs = ar.data.surahs;
const enSurahs = en.data.surahs;

const surahs = arSurahs.map((s, i) => {
  const e = enSurahs[i];
  return {
    number: s.number,
    nameArabic: s.name,
    nameEnglish: s.englishName,
    translation: s.englishNameTranslation,
    revelation: s.revelationType,
    ayahCount: s.ayahs.length,
    ayahs: s.ayahs.map((a, j) => ({
      number: a.numberInSurah,
      arabic: a.text,
      english: e.ayahs[j].text,
    })),
  };
});

writeFileSync("./quran.json", JSON.stringify({ surahs }));

const surahIndex = surahs.map((s) => ({
  number: s.number,
  nameArabic: s.nameArabic,
  nameEnglish: s.nameEnglish,
  translation: s.translation,
  revelation: s.revelation,
  ayahCount: s.ayahCount,
}));
writeFileSync("./surahs.json", JSON.stringify(surahIndex));

console.log(
  `Built: ${surahs.length} surahs, ${surahs.reduce((n, s) => n + s.ayahs.length, 0)} ayahs`
);
