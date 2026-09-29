"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { useState } from "react";
import ContentProtection from "./ContentProtection";
import CelebrationSection from "./CelebrationSection";
import CoupleStory from "./CoupleStory";
import FinalSection from "./FinalSection";
import FloatingControls from "./FloatingControls";
import HeroSection from "./HeroSection";
import InvitationOpening from "./InvitationOpening";
import { MusicProvider } from "./MusicPlayer";
import { FloralDefs } from "./decor/florals";

/**
 * The film, in order:
 * Opening invitation → Dr. Rahul & Sweta → Two Souls, One Journey (with
 * the families' blessings) → Vivah details (with Chheka · Matkor) → Thank You.
 *
 * LazyMotion + `m` components ship only the animation features used here
 * (animations, variants, exit, in-view), keeping the initial bundle small.
 */
export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);

  return (
    <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
      <MusicProvider>
        <ContentProtection />
        <FloralDefs />
        <InvitationOpening onOpen={() => setOpened(true)} />
        <main>
          <HeroSection revealed={opened} />
          <CoupleStory />
          <CelebrationSection />
          <FinalSection />
        </main>
        <FloatingControls visible={opened} />
      </MusicProvider>
    </MotionConfig>
    </LazyMotion>
  );
}
