"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { weddingData } from "@/data/weddingData";

interface MusicState {
  /** True once the guest has opened the invitation (audio is allowed). */
  unlocked: boolean;
  playing: boolean;
  /** Call from a user gesture. Respects a mute chosen earlier this session. */
  begin: () => void;
  toggle: () => void;
}

const MusicContext = createContext<MusicState | null>(null);

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside <MusicProvider>");
  return ctx;
}

const { storageKey, src, volume: TARGET_VOLUME } = weddingData.music;

const readMuted = () => {
  try {
    return sessionStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
};
const writeMuted = (muted: boolean) => {
  try {
    sessionStorage.setItem(storageKey, muted ? "1" : "0");
  } catch {
    /* ignore */
  }
};

interface Track {
  /** Resolves false if the browser refused to start playback. */
  play: () => Promise<boolean>;
  pause: () => void;
}

/**
 * Background track. The <audio> element is created lazily on the guest's first
 * tap, so nothing is downloaded before then; the file then streams
 * progressively and never blocks rendering. Volume fades use rAF where the
 * browser allows it (iOS Safari keeps volume fixed, so it just plays/pauses).
 */
function createTrack(url: string): Track {
  const audio = new Audio();
  audio.preload = "auto";
  audio.loop = true;
  audio.src = url;
  audio.volume = 0.5;
  const canFade = Math.abs(audio.volume - 0.5) < 0.01;
  audio.volume = canFade ? 0 : 1;

  let raf = 0;
  const fadeTo = (target: number, ms: number, done?: () => void) => {
    cancelAnimationFrame(raf);
    if (!canFade) return done?.();
    const from = audio.volume;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      audio.volume = Math.min(1, Math.max(0, from + (target - from) * t));
      if (t < 1) raf = requestAnimationFrame(step);
      else done?.();
    };
    raf = requestAnimationFrame(step);
  };

  return {
    play: () =>
      audio
        .play()
        .then(() => {
          fadeTo(TARGET_VOLUME, 2400);
          return true;
        })
        .catch(() => false),
    pause: () => fadeTo(0, 700, () => audio.pause()),
  };
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const track = useRef<Track | null>(null);
  const playingRef = useRef(false);
  const [unlocked, setUnlocked] = useState(false);
  const [playing, setPlaying] = useState(false);

  const ensureTrack = useCallback(() => {
    if (!track.current && src) track.current = createTrack(src);
    return track.current;
  }, []);

  const setIntent = useCallback((on: boolean) => {
    playingRef.current = on;
    setPlaying(on);
  }, []);

  /**
   * Start playback; if the browser blocks it (strict autoplay rules), retry
   * on the guest's next tap / key press.
   */
  const start = useCallback(() => {
    const t = ensureTrack();
    if (!t) return;
    void t.play().then((ok) => {
      if (ok) return;
      const retry = () => {
        events.forEach((e) => window.removeEventListener(e, retry, true));
        if (playingRef.current) void t.play();
      };
      const events = ["pointerdown", "touchend", "keydown"] as const;
      events.forEach((e) => window.addEventListener(e, retry, { capture: true, passive: true }));
    });
  }, [ensureTrack]);

  const begin = useCallback(() => {
    setUnlocked(true);
    if (readMuted()) return;
    setIntent(true);
    start();
  }, [setIntent, start]);

  const toggle = useCallback(() => {
    setUnlocked(true);
    const was = playingRef.current;
    if (was) track.current?.pause();
    else start();
    writeMuted(was);
    setIntent(!was);
  }, [setIntent, start]);

  // Pause politely when the guest switches apps (WhatsApp → back).
  useEffect(() => {
    const onVis = () => {
      if (!track.current || !playingRef.current) return;
      if (document.hidden) track.current.pause();
      else void track.current.play();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const value = useMemo(() => ({ unlocked, playing, begin, toggle }), [unlocked, playing, begin, toggle]);
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

/** Circular ♫ / mute control with a quiet equaliser while playing. */
export function MusicToggle({ className = "", bare = false }: { className?: string; bare?: boolean }) {
  const { playing, toggle } = useMusic();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Mute music" : "Play music"}
      title={weddingData.music.title}
      className={`group relative grid place-items-center rounded-full text-gold-light transition active:scale-95 ${
        bare ? "h-10 w-10 hover:bg-gold/10" : "h-12 w-12 border border-gold/60 bg-deep-maroon/85 hover:border-gold-light"
      } ${className}`}
    >
      {playing ? (
        <span className="flex h-4 items-end gap-[3px]" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-[2px] rounded-full bg-gold-light"
              style={{ height: "100%", animation: `eq 1.${2 + i}s ${i * 0.15}s ease-in-out infinite alternate`, transformOrigin: "bottom" }}
            />
          ))}
        </span>
      ) : (
        <span className="relative text-lg leading-none" aria-hidden>
          ♫<span className="absolute left-1/2 top-1/2 h-[1.5px] w-6 -translate-x-1/2 -translate-y-1/2 rotate-[-40deg] bg-gold-light" />
        </span>
      )}
      <style>{`@keyframes eq{from{transform:scaleY(.25)}to{transform:scaleY(1)}}`}</style>
    </button>
  );
}
