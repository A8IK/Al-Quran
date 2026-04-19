import { notFound } from "next/navigation";
import { getAllSurahNumbers, getSurah, getAllSurahs } from "@/lib/quran";
import SurahView from "@/components/SurahView";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSurahNumbers().map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const surah = getSurah(id);
  if (!surah) return { title: "Not found" };
  return {
    title: `${surah.nameEnglish} — ${surah.translation} · Quran`,
    description: `Read Surah ${surah.nameEnglish} (${surah.translation}) with Arabic text and English translation.`,
  };
}

export default async function SurahPage({ params }) {
  const { id } = await params;
  const surah = getSurah(id);
  if (!surah) notFound();

  const all = getAllSurahs();
  const prev = all.find((s) => s.number === surah.number - 1) || null;
  const next = all.find((s) => s.number === surah.number + 1) || null;

  return <SurahView surah={surah} prev={prev} next={next} />;
}
