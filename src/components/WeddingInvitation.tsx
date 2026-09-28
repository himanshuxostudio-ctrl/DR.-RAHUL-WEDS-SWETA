"use client";

import { MotionConfig } from "framer-motion";
import { useState } from "react";
import CoupleStory from "./CoupleStory";
import FamilySection from "./FamilySection";
import FinalSection from "./FinalSection";
import FloatingControls from "./FloatingControls";
import Gallery from "./Gallery";
import HeroSection from "./HeroSection";
import InvitationOpening from "./InvitationOpening";
import { MusicProvider } from "./MusicPlayer";
import RSVPSection from "./RSVPSection";
import VenueSection from "./VenueSection";
import WeddingCountdown from "./WeddingCountdown";
import WeddingTimeline from "./WeddingTimeline";
import { SvgDefs } from "./decor/Ornaments";

/**
 * INVITATION → COUPLE → FAMILY → CELEBRATIONS (Chheka · Matkor · Vivah)
 * → VENUE → COUNTDOWN → GALLERY → RSVP → FINAL
 */
export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <MusicProvider>
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
          <RSVPSection />
          <FinalSection />
        </main>
        <FloatingControls visible={opened} />
      </MusicProvider>
    </MotionConfig>
  );
}
