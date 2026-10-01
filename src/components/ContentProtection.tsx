"use client";

import { useEffect } from "react";

// Deterrent only (not security): no context menu, selection, image drag or
// devtools/view-source/save shortcuts. Taps, scrolling, links, controls,
// keyboard navigation, screen readers and editable fields are unaffected.
// Event-driven only — no polling or timers running in the background.

const NOTICE =
  "%cSweta & Dr. Rahul — private wedding invitation%c\nThe design, photographs and music on this page are private and may not be copied or reused.";
const NOTICE_STYLE = ["font:600 15px Georgia,serif;color:#c9a45c", "font:12px system-ui;color:#999"];

const isEditable = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || !!t.closest("input, textarea, select, [contenteditable='true']"));

function isBlockedShortcut(e: KeyboardEvent) {
  const key = (e.key ?? "").toLowerCase();
  const mod = e.ctrlKey || e.metaKey;
  if (key === "f12") return true;
  if (mod && (e.shiftKey || e.altKey) && (key === "i" || key === "j" || key === "c" || key === "k")) return true;
  if (mod && (key === "u" || key === "s")) return true;
  return false;
}

/** Docked devtools shrink the viewport well below the window size. */
const devtoolsLikelyOpen = () =>
  window.matchMedia("(pointer: fine)").matches &&
  (window.outerWidth - window.innerWidth > 170 || window.outerHeight - window.innerHeight > 200);

export default function ContentProtection() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("protect");

    const notice = () => console.info(NOTICE, ...NOTICE_STYLE);
    notice();

    const onContextMenu = (e: MouseEvent) => {
      if (!isEditable(e.target)) e.preventDefault();
    };
    const onDragStart = (e: DragEvent) => {
      const t = e.target;
      if (t instanceof HTMLImageElement || t instanceof SVGElement || (t instanceof HTMLElement && t.closest("picture"))) e.preventDefault();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (isBlockedShortcut(e)) e.preventDefault();
    };

    let open = devtoolsLikelyOpen();
    let debounce: number | undefined;
    const onResize = () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => {
        const now = devtoolsLikelyOpen();
        if (now && !open) notice();
        open = now;
      }, 400);
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      root.classList.remove("protect");
      window.clearTimeout(debounce);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
