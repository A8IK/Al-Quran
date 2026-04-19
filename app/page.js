import HomeClient from "@/components/HomeClient";
import { getAllSurahs } from "@/lib/quran";

export default function Home() {
  const surahs = getAllSurahs();
  return <HomeClient surahs={surahs} />;
}
