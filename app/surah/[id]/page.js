import { notFound } from "next/navigation";
import { getSurah } from "@/lib/api";
import surahs from "@/data/surahs.json";
import quranData from "@/data/quran.json";
import SurahView from "@/components/SurahView";
import { getSurahBySlug, nameToSlug } from "@/lib/slugs";

export const dynamicParams = false;

export function generateStaticParams() {
  // Use slug format for URLs (Surah names converted to lowercase)
  return surahs.map((s) => ({ id: nameToSlug(s.nameEnglish) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  // Find by slug
  const surah = getSurahBySlug(id);
  if (!surah) return { title: "Not found" };
  return {
    title: `${surah.nameEnglish} — ${surah.translation} · Quran`,
    description: `Read Surah ${surah.nameEnglish} (${surah.translation}) with Arabic text and English translation.`,
  };
}

export default async function SurahPage({ params }) {
  const { id } = await params;
  
  // Find surah by slug
  const surahMeta = getSurahBySlug(id);
  if (!surahMeta) notFound();
  
  const surahNumber = surahMeta.number;
  
  // Try to fetch from API first
  let surah = await getSurah(surahNumber);
  
  // Fallback to local data if API fails
  if (!surah) {
    surah = quranData.surahs?.find((s) => s.number === surahNumber);
  }
  
  if (!surah) notFound();

  // Get prev/next surah data
  const prevNum = surahNumber > 1 ? surahNumber - 1 : null;
  const nextNum = surahNumber < 114 ? surahNumber + 1 : null;
  
  const prev = prevNum ? surahs.find((s) => s.number === prevNum) : null;
  const next = nextNum ? surahs.find((s) => s.number === nextNum) : null;

  return <SurahView surah={surah} prev={prev} next={next} />;
}
