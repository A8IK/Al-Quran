import { Lora, Inter, Amiri, Noto_Naskh_Arabic, Scheherazade_New } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";
import AppShell from "@/components/AppShell";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-naskh",
  display: "swap",
});

const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-scheherazade",
  display: "swap",
});

export const metadata = {
  title: "Quran — A Calm Reader",
  description:
    "Read the Holy Quran with Arabic text and English translation in a serene, distraction-free interface.",
};

const themeInit = `
  try {
    const s = JSON.parse(localStorage.getItem('quran-settings') || '{}');
    if (s.darkMode) document.documentElement.classList.add('dark');
  } catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${inter.variable} ${amiri.variable} ${naskh.variable} ${scheherazade.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full paper-grain">
        <SettingsProvider>
          <AppShell>{children}</AppShell>
        </SettingsProvider>
      </body>
    </html>
  );
}
