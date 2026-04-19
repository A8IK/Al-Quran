"use client";

import { useSettings, ARABIC_FONTS } from "@/context/SettingsContext";

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <path d="M6 6l12 12M18 6l-6 12" />
    </svg>
  );
}

function Slider({ label, value, min, max, step = 1, onChange, preview }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="font-sans text-sm text-ink-soft dark:text-cream-soft">
          {label}
        </label>
        <span className="font-sans text-xs text-ink-muted dark:text-cream-soft/70 tabular-nums">
          {value}px
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-ink dark:accent-sage"
      />
      {preview}
    </div>
  );
}

export default function SettingsPanel({ open, onClose }) {
  const { settings, update, reset } = useSettings();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-ink/30 dark:bg-night/70 z-40 backdrop-blur-sm"
        />
      )}
      <aside
        className={`
          fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-parchment-50 dark:bg-night-soft
          border-l border-parchment-200 dark:border-night-card
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
          flex flex-col
        `}
      >
        <div className="px-5 h-16 flex items-center justify-between border-b border-parchment-200 dark:border-night-card shrink-0">
          <h2 className="font-serif text-lg text-emerald-ink dark:text-sage">
            Reading Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-parchment-100 dark:hover:bg-night-card text-ink-soft dark:text-cream-soft"
            aria-label="Close settings"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Arabic font selection */}
          <section>
            <h3 className="font-sans text-xs uppercase tracking-wider text-ink-muted dark:text-cream-soft/60 mb-3">
              Arabic Script
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {ARABIC_FONTS.map((f) => {
                const active = settings.arabicFont === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => update({ arabicFont: f.id })}
                    className={`
                      rounded-xl p-4 text-center transition-all border
                      ${
                        active
                          ? "border-emerald-soft dark:border-sage bg-emerald-mist dark:bg-emerald-ink/20"
                          : "border-parchment-200 dark:border-night-card hover:border-parchment-300 dark:hover:border-sage/40 bg-parchment dark:bg-night-card"
                      }
                    `}
                  >
                    <div
                      className="arabic text-2xl mb-1 text-ink dark:text-cream"
                      style={{ fontFamily: f.cssVar, textAlign: "center" }}
                    >
                      بِسْمِ ٱللَّٰهِ
                    </div>
                    <div className="font-sans text-xs text-ink-muted dark:text-cream-soft/70">
                      {f.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Arabic font size */}
          <section>
            <h3 className="font-sans text-xs uppercase tracking-wider text-ink-muted dark:text-cream-soft/60 mb-3">
              Arabic Font Size
            </h3>
            <Slider
              label="Size"
              value={settings.arabicSize}
              min={20}
              max={56}
              onChange={(v) => update({ arabicSize: v })}
              preview={
                <div
                  className="arabic mt-3 text-ink dark:text-cream"
                  style={{
                    fontSize: `${settings.arabicSize}px`,
                    fontFamily: {
                      "king-fahad-v2": "var(--font-scheherazade)",
                      "king-fahad-v1": "var(--font-amiri)",
                      "qpc-utmani": "var(--font-naskh)",
                    }[settings.arabicFont] || "var(--font-scheherazade)",
                  }}
                >
                  بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
              }
            />
          </section>

          {/* Translation font size */}
          <section>
            <h3 className="font-sans text-xs uppercase tracking-wider text-ink-muted dark:text-cream-soft/60 mb-3">
              Translation Font Size
            </h3>
            <Slider
              label="Size"
              value={settings.translationSize}
              min={12}
              max={24}
              onChange={(v) => update({ translationSize: v })}
              preview={
                <p
                  className="mt-3 font-serif text-ink-soft dark:text-cream-soft/90 leading-relaxed"
                  style={{ fontSize: `${settings.translationSize}px` }}
                >
                  In the name of Allah, the Lord of Mercy, the Giver of Mercy.
                </p>
              }
            />
          </section>

          {/* Toggles */}
          <section>
            <h3 className="font-sans text-xs uppercase tracking-wider text-ink-muted dark:text-cream-soft/60 mb-3">
              Display
            </h3>
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="font-sans text-sm text-ink-soft dark:text-cream-soft">
                Show translation
              </span>
              <input
                type="checkbox"
                checked={settings.showTranslation}
                onChange={(e) => update({ showTranslation: e.target.checked })}
                className="w-4 h-4 accent-emerald-ink dark:accent-sage"
              />
            </label>
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="font-sans text-sm text-ink-soft dark:text-cream-soft">
                Dark mode
              </span>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => update({ darkMode: e.target.checked })}
                className="w-4 h-4 accent-emerald-ink dark:accent-sage"
              />
            </label>
          </section>

          <button
            onClick={reset}
            className="w-full mt-4 py-2.5 rounded-lg font-sans text-sm text-ink-muted dark:text-cream-soft/70 hover:text-emerald-ink dark:hover:text-sage border border-parchment-200 dark:border-night-card hover:border-emerald-soft/40 dark:hover:border-sage/40 transition-colors"
          >
            Reset to defaults
          </button>
        </div>
      </aside>
    </>
  );
}
