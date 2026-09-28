"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { weddingData } from "@/data/weddingData";
import { LotusMark } from "./decor/Ornaments";
import { MusicToggle } from "./MusicPlayer";

const { navigation, couple } = weddingData;

/** Minimal floating controls: RSVP · Menu · Music. */
export default function FloatingControls({ visible }: { visible: boolean }) {
  const [menu, setMenu] = useState(false);
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
    "grid h-12 w-12 place-items-center rounded-full border border-gold/60 bg-deep-maroon/70 text-gold-light backdrop-blur-md transition hover:border-gold-light";

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[60] flex items-center gap-2.5 sm:bottom-6 sm:right-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="#rsvp"
              className="flex h-12 items-center rounded-full border border-gold/60 bg-deep-maroon/70 px-5 text-[0.68rem] font-semibold tracking-[0.24em] text-gold-light backdrop-blur-md transition hover:border-gold-light"
            >
              RSVP
            </a>
            <button ref={menuBtn} type="button" className={round} aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}>
              <Menu className="h-5 w-5" aria-hidden />
            </button>
            <MusicToggle />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menu && (
          <motion.nav
            aria-label="Invitation sections"
            className="surface-maroon fixed inset-0 z-[85] flex flex-col items-center justify-center px-6"
            initial={{ clipPath: "circle(0% at calc(100% - 5rem) calc(100% - 3rem))" }}
            animate={{ clipPath: "circle(150% at calc(100% - 5rem) calc(100% - 3rem))" }}
            exit={{ clipPath: "circle(0% at calc(100% - 5rem) calc(100% - 3rem))" }}
            transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          >
            <div aria-hidden className="jaali absolute inset-0 opacity-[0.05]" />
            <div aria-hidden className="absolute inset-4 border border-gold/30" />
            <button type="button" aria-label="Close menu" onClick={() => setMenu(false)} className={`${round} absolute right-6 top-6`}>
              <X className="h-5 w-5" aria-hidden />
            </button>
            <LotusMark className="relative mb-6 h-8 w-12" />
            <p className="eyebrow relative mb-8 text-gold">{couple.title}</p>
            <ul className="relative space-y-1 text-center">
              <li>
                <a ref={firstLink} href="#top" onClick={() => setMenu(false)} className="block px-4 py-1.5 font-serif text-3xl text-ivory transition hover:text-gold-light sm:text-4xl">
                  Invitation
                </a>
              </li>
              {navigation.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                  <a href={`#${n.id}`} onClick={() => setMenu(false)} className="block px-4 py-1.5 font-serif text-3xl text-ivory transition hover:text-gold-light sm:text-4xl">
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
