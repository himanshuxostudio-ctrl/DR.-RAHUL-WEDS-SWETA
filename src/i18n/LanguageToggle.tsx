"use client";

/**
 * HINDI EXPERIMENT — the small EN | हिंदी switch.
 *
 * `floating` (default): fixed at the top-right, above the opening and the
 * menu; it steps aside while the guest scrolls down through the invitation
 * and returns on scroll-up or at the top. `inline`: a static copy for the
 * menu overlay, so the switch is always reachable.
 */
import { useEffect, useState } from "react";
import { HINDI_EXPERIMENT, useLang, useT, type Lang } from "./LanguageProvider";

function useShown() {
  const [shown, setShown] = useState(true);
  useEffect(() => {
    let lastY = window.scrollY;
    let current = true;
    const onScroll = () => {
      const y = window.scrollY;
      const next = y < 120 || y < lastY - 4 ? true : y > lastY + 4 ? false : current;
      lastY = y;
      if (next !== current) {
        current = next;
        setShown(next);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return shown;
}

function Options() {
  const { lang, setLang } = useLang();
  const t = useT();
  const opt = (l: Lang, label: string, extra: string) => (
    <button
      type="button"
      lang={l === "hi" ? "hi" : "en"}
      aria-pressed={lang === l}
      onClick={() => setLang(l)}
      className={`rounded-full px-2.5 py-1 leading-none transition-colors duration-300 ${extra} ${
        lang === l ? "bg-gold/90 text-deep-maroon" : "text-gold-light/80 hover:text-gold-light"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div role="group" aria-label={t.languageLabel} className="flex items-center gap-0.5 rounded-full border border-gold/45 bg-deep-maroon/75 p-[3px] shadow-[0_6px_18px_-8px_rgba(0,0,0,0.6)] backdrop-blur-sm">
      {opt("en", "EN", "font-sans text-[0.6rem] font-semibold tracking-[0.18em]")}
      <span aria-hidden className="h-3 w-px bg-gold/35" />
      {opt("hi", "हिंदी", "font-deva text-[0.78rem]")}
    </div>
  );
}

export default function LanguageToggle({ inline = false }: { inline?: boolean }) {
  const shown = useShown();
  if (!HINDI_EXPERIMENT) return null;
  if (inline) return <Options />;
  return (
    <div
      className={`fixed right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[90] transition-[opacity,transform] duration-500 ease-out sm:right-6 sm:top-6 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
      }`}
    >
      <Options />
    </div>
  );
}
