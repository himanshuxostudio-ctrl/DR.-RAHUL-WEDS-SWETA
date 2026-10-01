"use client";

/**
 * HINDI EXPERIMENT — language state for the whole invitation.
 *
 *  useLang()    → { lang, setLang }
 *  useT()       → interface strings for the current language (English fallback)
 *  useWedding() → weddingData with Hindi content laid over it (English fallback)
 *
 * English is the default. The choice is remembered in localStorage and
 * mirrored to <html lang>, which switches on the Hindi typography rules in
 * hindi.css. Setting HINDI_EXPERIMENT to false turns the whole experiment off
 * (English only, no toggle) without touching any component.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { weddingData, type WeddingData } from "@/data/weddingData";
import { hindiContent, translations, type UIStrings } from "./translations";

export const HINDI_EXPERIMENT = true;

export type Lang = "en" | "hi";
const STORAGE_KEY = "rw-lang";

type Plain = Record<string, unknown>;
const isPlain = (v: unknown): v is Plain => typeof v === "object" && v !== null && !Array.isArray(v);
/** A usable translation: anything but undefined / null / an empty string. */
const present = (v: unknown) => v !== undefined && v !== null && !(typeof v === "string" && v.trim() === "");

/** Lay `over` onto `base`, key by key; missing or empty values keep the English original. */
function overlay(base: unknown, over: unknown): unknown {
  if (isPlain(base) && isPlain(over)) {
    const out: Plain = { ...base };
    for (const k of Object.keys(base)) if (k in over) out[k] = overlay(base[k], over[k]);
    return out;
  }
  if (typeof base === "function") return present(over) ? over : base;
  if (typeof base === typeof over && present(over)) return over;
  return base;
}

function buildHindi(): WeddingData {
  const { events, navigation, ...rest } = hindiContent;
  const data = overlay(weddingData, rest) as Plain;
  data.events = weddingData.events.map((e) => overlay(e, (events as Plain)[e.id]));
  data.navigation = weddingData.navigation.map((n) => overlay(n, { label: (navigation as Plain)[n.id] }));
  return data as unknown as WeddingData;
}

const HINDI_DATA = buildHindi();
const HINDI_UI = overlay(translations.en, translations.hi) as UIStrings;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const first = useRef(true);

  // restore the visitor's choice (English if nothing stored or storage blocked)
  useEffect(() => {
    if (!HINDI_EXPERIMENT) return;
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "hi") setLangState("hi");
    } catch {
      /* storage unavailable — stay in English */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang === "hi" ? "hi" : "en-IN";
    if (first.current) {
      first.current = false;
      return;
    }
    // a soft cross-fade while the words change
    root.classList.add("lang-switching");
    const id = window.setTimeout(() => root.classList.remove("lang-switching"), 500);
    return () => window.clearTimeout(id);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    if (!HINDI_EXPERIMENT) return;
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
export const useT = (): UIStrings => (useContext(LangContext).lang === "hi" ? HINDI_UI : (translations.en as unknown as UIStrings));
export const useWedding = (): WeddingData => (useContext(LangContext).lang === "hi" ? HINDI_DATA : weddingData);
