"use client";

import { AnimatePresence, m } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useT, useWedding } from "@/i18n/LanguageProvider"; // HINDI EXPERIMENT
import LanguageToggle from "@/i18n/LanguageToggle"; // HINDI EXPERIMENT
import { LotusMark } from "./decor/Ornaments";
import { MusicToggle } from "./MusicPlayer";


/**
 * Slides the controls out of the way while the guest scrolls down (so they
 * never sit on top of buttons like MAP), and brings them back on scroll-up or
 * once scrolling pauses. One passive listener; state only changes on flips.
 */
function useScrollAway() {
  const [away, setAway] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let current = false;
    let idle: number | undefined;
    const set = (v: boolean) => {
      if (v !== current) {
        current = v;
        setAway(v);
      }
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY + 6) set(true);
      else if (y < lastY - 6) set(false);
      lastY = y;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => set(false), 900);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
    };
  }, []);
  return away;
}

/** True while the opening frame (hero) fills most of the screen. */
function useAtHero() {
  const [at, setAt] = useState(true);
  useEffect(() => {
    const el = document.getElementById("top");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAt(e.intersectionRatio > 0.72), { threshold: [0, 0.72, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return at;
}

/** True while the closing (Thank You → finale) screens are on screen. */
function useAtClosing() {
  const [at, setAt] = useState(false);
  useEffect(() => {
    const el = document.getElementById("closing");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAt(e.isIntersecting), { rootMargin: "0px 0px -40% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return at;
}

/**
 * The floating control: one gold-edged pill — Menu · Music. It slides away
 * while scrolling down. On the opening frame and the closing screens the menu
 * folds away, leaving only the small music control (clear of "Scroll to Begin").
 */
export default function FloatingControls({ visible }: { visible: boolean }) {
  const { navigation, couple } = useWedding();
  const t = useT();
  const [menu, setMenu] = useState(false);
  const away = useScrollAway();
  const closing = useAtClosing();
  const atHero = useAtHero();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!menu) return;
    firstLink.current?.focus();
    document.body.classList.add("is-locked");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("is-locked");
      document.removeEventListener("keydown", onKey);
      menuBtn.current?.focus();
    };
  }, [menu]);

  const round =
    "grid h-12 w-12 place-items-center rounded-full border border-gold/60 bg-deep-maroon/85 text-gold-light transition hover:border-gold-light active:scale-95";

  return (
    <>
      <AnimatePresence>
        {visible && (
          <m.div
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[60] sm:bottom-6 sm:right-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 3.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <m.div
              className="flex h-12 items-center rounded-full border border-gold/55 bg-deep-maroon/90 p-1 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)]"
              animate={{ y: away ? 90 : 0, opacity: away ? 0 : closing ? 0.85 : 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnimatePresence initial={false}>
                {!closing && !atHero && (
                  <m.div
                    key="menu"
                    className="flex items-center overflow-hidden"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      ref={menuBtn}
                      type="button"
                      aria-label={t.openMenu}
                      aria-expanded={menu}
                      onClick={() => setMenu(true)}
                      className="group flex h-10 items-center gap-2 whitespace-nowrap rounded-full pl-3.5 pr-3 text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-gold-light transition hover:bg-gold/10 active:scale-95"
                    >
                      <Menu className="h-4 w-4 transition-transform duration-500 group-hover:rotate-90" aria-hidden />
                      {t.menu}
                    </button>
                    <span aria-hidden className="mx-0.5 h-5 w-px bg-gold/35" />
                  </m.div>
                )}
              </AnimatePresence>
              <MusicToggle bare />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menu && (
          <m.nav
            aria-label={t.navLabel}
            className="surface-maroon fixed inset-0 z-[85] flex flex-col items-center justify-center px-6"
            initial={{ clipPath: "circle(0% at calc(100% - 4rem) calc(100% - 2.5rem))" }}
            animate={{ clipPath: "circle(150% at calc(100% - 4rem) calc(100% - 2.5rem))" }}
            exit={{ clipPath: "circle(0% at calc(100% - 4rem) calc(100% - 2.5rem))" }}
            transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          >
            <div aria-hidden className="jaali absolute inset-0 opacity-[0.05]" />
            <div aria-hidden className="absolute inset-4 border border-gold/30" />
            <button type="button" aria-label={t.closeMenu} onClick={() => setMenu(false)} className={`${round} absolute right-6 top-6`}>
              <X className="h-5 w-5" aria-hidden />
            </button>
            <LotusMark className="relative mb-6 h-8 w-12" />
            <p className="eyebrow relative mb-8 text-gold">{couple.title}</p>
            {/* HINDI EXPERIMENT: language switch, always reachable from the menu */}
            <div className="absolute left-6 top-6">
              <LanguageToggle inline />
            </div>
            <ul className="relative space-y-1 text-center">
              <li>
                <a ref={firstLink} href="#top" onClick={() => setMenu(false)} className="block px-4 py-1.5 font-serif text-3xl text-ivory transition hover:text-gold-light sm:text-4xl">
                  {t.navInvitation}
                </a>
              </li>
              {navigation.map((n, i) => (
                <m.li key={n.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                  <a href={`#${n.id}`} onClick={() => setMenu(false)} className="block px-4 py-1.5 font-serif text-3xl text-ivory transition hover:text-gold-light sm:text-4xl">
                    {n.label}
                  </a>
                </m.li>
              ))}
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </>
  );
}
