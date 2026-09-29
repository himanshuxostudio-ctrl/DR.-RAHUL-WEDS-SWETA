"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { useState } from "react";
import ContentProtection from "./ContentProtection";
import CoupleStory from "./CoupleStory";
import FamilySection from "./FamilySection";
import FinalSection from "./FinalSection";
import FloatingControls from "./FloatingControls";
import Gallery from "./Gallery";
import HeroSection from "./HeroSection";
import InvitationOpening from "./InvitationOpening";
import { MusicProvider } from "./MusicPlayer";
import VenueSection from "./VenueSection";
import WeddingCountdown from "./WeddingCountdown";
import WeddingTimeline from "./WeddingTimeline";
import { SvgDefs } from "./decor/Ornaments";

/**
 * The film, in order:
 * Opening invitation → Dr. Rahul & Sweta → Two Hearts, One Journey →
 * Family blessings → Celebrations (Chheka · Matkor · Vivaah) → Venue →
 * Countdown → Gallery → Final wedding image → Thank You.
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
        <SvgDefs />
        <InvitationOpening onOpen={() => setOpened(true)} />
        <main>
          <HeroSection revealed={opened} />
          <CoupleStory />
          <FamilySection />
          <WeddingTimeline />
          <VenueSection />
          <WeddingCountdown />
          <Gallery />
          <FinalSection />
        </main>
        <FloatingControls visible={opened} />
      </MusicProvider>
    </MotionConfig>
    </LazyMotion>
  );
}
