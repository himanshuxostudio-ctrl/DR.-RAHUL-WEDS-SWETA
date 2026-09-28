"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { weddingData } from "@/data/weddingData";
import { createRagaEngine, type RagaEngine } from "@/lib/ragaEngine";

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

const { storageKey, src } = weddingData.music;

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

/** Uniform interface over a real audio file or the generative raga. */
interface Voice {
  play: () => void;
  pause: () => void;
}

function createVoice(): Voice | null {
  if (src) {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0;
    let fade: number | undefined;
    const fadeTo = (target: number, after?: () => void) => {
      window.clearInterval(fade);
      fade = window.setInterval(() => {
        const next = audio.volume + (target > audio.volume ? 0.04 : -0.06);
        audio.volume = Math.min(1, Math.max(0, next));
        if (Math.abs(audio.volume - target) < 0.05) {
          audio.volume = target;
          window.clearInterval(fade);
          after?.();
        }
      }, 60);
    };
    return {
      play: () => void audio.play().then(() => fadeTo(0.7)).catch(() => undefined),
      pause: () => fadeTo(0, () => audio.pause()),
    };
  }
  const engine: RagaEngine | null = createRagaEngine();
  if (!engine) return null;
  let begun = false;
  return {
    play: () => {
      if (!begun) {
        begun = true;
        void engine.start();
      } else engine.fadeIn();
    },
    pause: () => engine.fadeOut(),
  };
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const voice = useRef<Voice | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [playing, setPlaying] = useState(false);

  const ensureVoice = useCallback(() => {
    if (!voice.current) voice.current = createVoice();
    return voice.current;
  }, []);

  const begin = useCallback(() => {
    setUnlocked(true);
    if (readMuted()) return;
    ensureVoice()?.play();
    setPlaying(true);
  }, [ensureVoice]);

  const playingRef = useRef(false);
  playingRef.current = playing;

  const toggle = useCallback(() => {
    setUnlocked(true);
    const was = playingRef.current;
    const v = ensureVoice();
    if (was) v?.pause();
    else v?.play();
    writeMuted(was);
    setPlaying(!was);
  }, [ensureVoice]);

  // Pause politely when the guest switches apps (WhatsApp → back).
  useEffect(() => {
    const onVis = () => {
      if (!voice.current || !playing) return;
      if (document.hidden) voice.current.pause();
      else voice.current.play();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [playing]);

  const value = useMemo(() => ({ unlocked, playing, begin, toggle }), [unlocked, playing, begin, toggle]);
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

/** Circular ♫ / mute control with a quiet equaliser while playing. */
export function MusicToggle({ className = "" }: { className?: string }) {
  const { playing, toggle } = useMusic();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Mute music" : "Play music"}
      title={weddingData.music.title}
      className={`group relative grid h-12 w-12 place-items-center rounded-full border border-gold/60 bg-deep-maroon/70 text-gold-light backdrop-blur-md transition hover:border-gold-light ${className}`}
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
