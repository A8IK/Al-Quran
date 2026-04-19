"use client";

import { useState } from "react";
import { useSettings } from "@/context/SettingsContext";

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
function arNum(n) {
  return String(n)
    .split("")
    .map((d) => AR_DIGITS[Number(d)])
    .join("");
}

function CopyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function AyahCard({ ayah }) {
  const { settings, hydrated } = useSettings();
  const [copied, setCopied] = useState(false);

  const arabicFont = {
    "king-fahad-v2": "var(--font-scheherazade)",
    "king-fahad-v1": "var(--font-amiri)",
    "qpc-utmani": "var(--font-naskh)",
  }[settings.arabicFont] || "var(--font-scheherazade)";

  const handleCopy = () => {
    const text = `${ayah.arabic}\n\n${ayah.english}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      console.error("Failed to copy to clipboard");
    });
  };

  return (
    <article className="p-5 sm:p-7 rounded-2xl bg-parchment-50 dark:bg-night-card border border-parchment-200/50 dark:border-night-card hover:border-emerald-soft/30 dark:hover:border-sage/30 transition-colors">
      {/* Header row: ayah number rosette */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <svg
            viewBox="0 0 48 48"
            className="w-9 h-9 text-gold/70"
            fill="currentColor"
          >
            <path d="M24 2l4 5 6-2 1 6 6 1-2 6 5 4-5 4 2 6-6 1-1 6-6-2-4 5-4-5-6 2-1-6-6-1 2-6-5-4 5-4-2-6 6-1 1-6 6 2z" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-sans text-[11px] font-medium text-parchment dark:text-night">
            {ayah.number}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="arabic text-xl text-gold-deep/80 dark:text-gold"
            style={{ fontFamily: arabicFont }}
          >
            {arNum(ayah.number)}
          </span>
          <button
            onClick={handleCopy}
            className={`p-1.5 rounded-md transition-colors ${
              copied
                ? "bg-emerald-mist text-emerald-deep dark:bg-sage/20 dark:text-sage"
                : "text-ink-muted dark:text-cream-soft/60 hover:bg-parchment-100 dark:hover:bg-night-soft hover:text-ink-soft dark:hover:text-cream-soft"
            }`}
            title={copied ? "Copied!" : "Copy verse"}
            aria-label="Copy verse"
          >
            {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Arabic text */}
      <p
        className="arabic text-ink dark:text-cream mb-5"
        style={{
          fontFamily: arabicFont,
          fontSize: hydrated ? `${settings.arabicSize}px` : "32px",
        }}
      >
        {ayah.arabic}
      </p>

      {/* Translation */}
      {(!hydrated || settings.showTranslation) && (
        <p
          className="font-serif text-ink-soft dark:text-cream-soft/90 leading-relaxed pt-4 border-t border-parchment-200/50 dark:border-night-soft"
          style={{
            fontSize: hydrated ? `${settings.translationSize}px` : "16px",
          }}
        >
          {ayah.english}
        </p>
      )}
    </article>
  );
}
