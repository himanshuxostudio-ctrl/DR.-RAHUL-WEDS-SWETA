/**
 * Single source of truth for everything shown on the invitation.
 *
 * Components never hard-code names, dates, venues or images — edit here.
 * Anything not yet confirmed by the family is marked with a clearly visible
 * "[… TO BE ADDED]" placeholder rather than invented.
 */
import { imageManifest, type ImageId } from "./imageManifest.generated";

export type EventTheme = "chheka" | "matkor" | "vivah";

export interface WeddingEvent {
  id: EventTheme;
  index: string;
  name: string;
  nameHindi: string;
  date: string;
  weekday: string;
  time: string;
  /** ISO start in Indian Standard Time — drives countdown + calendar files. */
  start: string;
  /** Used only for calendar entries (end time). */
  durationHours: number;
  venue: string;
  location: string;
  address?: string;
  mapsUrl?: string;
  description: string;
  theme: EventTheme;
}

export interface WeddingImage {
  id: ImageId;
  alt: string;
}

const img = (id: ImageId, alt: string): WeddingImage => ({ id, alt });

export const weddingData = {
  couple: {
    groom: "Dr. Rahul",
    groomFirstName: "Rahul",
    bride: "Sweta",
    title: "Dr. Rahul Weds Sweta",
    date: "12 December 2026",
    dateShort: "12.12.2026",
    city: "Chapra, Bihar",
  },

  invitation: {
    hindiTitle: "शुभ विवाह",
    cordially: "You are cordially invited",
    weds: "weds",
    openButton: "Open Invitation",
    blessingLine:
      "With the blessings of our parents and elders, we invite you to celebrate the beginning of a beautiful new chapter.",
  },

  story: {
    eyebrow: "Our Story",
    titleA: "Two Souls",
    titleB: "One Journey",
    groomLabel: "The Groom",
    brideLabel: "The Bride",
    interludeEyebrow: "And then comes the day",
    interludeTitle: "Vivah",
  },

  families: {
    heading: "With the Blessings of Our Families",
    intro: "With the blessings of our parents and elders, we invite you to celebrate the wedding of",
    groom: {
      label: "Groom's Family",
      father: "Dr. Birendra Kumar Singh",
      fatherTitle: "Retired Principal",
      mother: "Smt. Renu Singh",
    },
    bride: {
      label: "Bride's Family",
      grandfather: "Late. Nagnarayan Singh",
      grandfatherTitle: "Grandfather",
      father: "Shree Chandrasekhar Singh",
      mother: "Smt. Savita Devi",
    },
  },

  celebrations: {
    eyebrow: "Three days · Three blessings",
    heading: "The Celebrations",
  },

  events: [
    {
      id: "chheka",
      index: "01",
      name: "Chheka",
      nameHindi: "छेका",
      date: "09 December 2026",
      weekday: "Wednesday",
      time: "6:00 PM",
      start: "2026-12-09T18:00:00+05:30",
      durationHours: 4,
      venue: "Madhwara",
      location: "Saran, Chapra, Bihar",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Madhwara%2C%20Saran%2C%20Bihar",
      description:
        "The first of our celebrations — a traditional ceremony in which our two families come together to formally bless the union.",
      theme: "chheka",
    },
    {
      id: "matkor",
      index: "02",
      name: "Matkor",
      nameHindi: "मटकोर",
      date: "10 December 2026",
      weekday: "Thursday",
      time: "6:00 PM onwards",
      start: "2026-12-10T18:00:00+05:30",
      durationHours: 4,
      venue: "At Home",
      location: "Chapra, Bihar",
      description:
        "An age-old ritual honouring Mother Earth, celebrated at home with folk songs, prayers and the women of the family.",
      theme: "matkor",
    },
    {
      id: "vivah",
      index: "03",
      name: "Vivah",
      nameHindi: "विवाह",
      date: "12 December 2026",
      weekday: "Saturday",
      time: "6:00 PM onwards",
      start: "2026-12-12T18:00:00+05:30",
      durationHours: 6,
      venue: "Jalsa Palace",
      location: "Chapra, Bihar",
      address: "SH 90, Prabhunath Nagar, Ratanpura, Chapra, Bihar 841301",
      mapsUrl: "https://share.google/sAcMc7IIyEE8ilCVZ",
      description:
        "The sacred wedding ceremony — vows taken before the holy fire, in the presence of our families and dearest ones.",
      theme: "vivah",
    },
  ] satisfies readonly WeddingEvent[],

  venue: {
    eyebrow: "The Wedding Venue",
    name: "Jalsa Palace",
    addressLines: ["SH 90, Prabhunath Nagar,", "Ratanpura, Chapra,", "Bihar 841301"],
    mapsUrl: "https://share.google/sAcMc7IIyEE8ilCVZ",
    directionsLabel: "Get Directions",
  },

  countdown: {
    heading: "The Wait Is Almost Over",
    target: "2026-12-12T18:00:00+05:30",
    caption: "12 December 2026 · 6:00 PM onwards",
    arrived: "Today we celebrate",
  },

  images: {
    heroWide: img("couple/rahul-sweta-hero-wide", "Dr. Rahul and Sweta smiling together, her hand resting on his shoulder"),
    heroPortrait: img("couple/rahul-sweta-hero-portrait", "Dr. Rahul and Sweta smiling together, her hand resting on his shoulder"),
    togetherWide: img("couple/rahul-sweta-together-wide", "Dr. Rahul and Sweta standing back to back, arms folded, smiling"),
    togetherMobile: img("couple/rahul-sweta-together-mobile", "Dr. Rahul and Sweta standing back to back, arms folded, smiling"),
    formal: img("couple/rahul-sweta-formal", "Dr. Rahul in a grey suit and Sweta in a champagne lehenga, standing together"),
    candid: img("couple/rahul-sweta-candid", "Sweta smiling shyly as Dr. Rahul holds her wrist and leans against the wall"),
    brideportrait: img("couple/sweta-portrait", "Sweta in an embroidered champagne lehenga, looking away with a gentle smile"),
  },

  gallery: {
    eyebrow: "The Gallery",
    heading: ["Moments", "Before", "Forever"],
    /**
     * Editorial sequence. `layout` picks one of the reusable framing
     * treatments in <Gallery/>.
     */
    items: [
      { ...img("couple/sweta-portrait", "Sweta in her champagne lehenga, looking over her shoulder"), layout: "portrait-lead" },
      { ...img("couple/rahul-sweta-hero-wide", "Dr. Rahul and Sweta smiling together"), layout: "pair-left" },
      { ...img("gallery/detail-mehndi-clutch", "Sweta's mehndi-adorned hands holding a jewelled clutch"), layout: "pair-right" },
      { ...img("couple/rahul-sweta-together-wide", "Dr. Rahul and Sweta back to back"), layout: "cinematic" },
      { ...img("gallery/detail-rahul-profile", "Dr. Rahul in profile, smiling softly"), layout: "offset-left" },
      { ...img("gallery/detail-sweta-profile", "Sweta in profile wearing diamond earrings"), layout: "offset-right" },
      { ...img("gallery/detail-hand-on-shoulder", "Sweta's hennaed hand and ring resting on Dr. Rahul's shoulder"), layout: "detail" },
      { ...img("couple/rahul-sweta-formal", "Dr. Rahul and Sweta standing together in their wedding attire"), layout: "portrait-closing" },
    ] as (WeddingImage & { layout: string })[],
  },

  music: {
    /**
     * Instrumental only. Drop a licensed instrumental track (shehnai / sitar /
     * bansuri — no vocals) at /public/audio/ and set `src` to use it; while
     * `src` is null the site plays its own generative bansuri-and-tanpura
     * raga (Bhupali), synthesised live in the browser.
     */
    src: null as string | null,
    title: "Raag Bhupali · bansuri & tanpura",
    storageKey: "rw-music-muted",
  },

  rsvp: {
    eyebrow: "Kindly Respond",
    heading: "Will You Join Us?",
    deadline: "[RSVP DEADLINE TO BE ADDED]",
    /**
     * Set NEXT_PUBLIC_RSVP_ENDPOINT (Google Apps Script web-app URL or a
     * Supabase Edge Function) to collect responses. Without it responses are
     * kept on the guest's device only (mock mode).
     */
    endpointEnv: "NEXT_PUBLIC_RSVP_ENDPOINT",
    maxGuests: 10,
    thankYou: "Thank you — your response means the world to us.",
  },

  final: {
    heading: "Thank You",
    message: "Your presence will make our celebration even more special.",
    signoff: "With love, laughter and the blessings of our families.",
  },

  navigation: [
    { id: "story", label: "Our Story" },
    { id: "family", label: "Families" },
    { id: "celebrations", label: "Celebrations" },
    { id: "venue", label: "Venue" },
    { id: "countdown", label: "Countdown" },
    { id: "gallery", label: "Gallery" },
    { id: "rsvp", label: "RSVP" },
  ],

  seo: {
    title: "Dr. Rahul Weds Sweta | 12 December 2026",
    description: "Join us in celebrating the wedding of Dr. Rahul and Sweta on 12 December 2026.",
    ogImage: "/og/rahul-sweta-og.jpg",
    ogImageAlt: "Dr. Rahul weds Sweta — 12 December 2026",
    themeColor: "#2a0a10",
  },
} as const;

export const getImage = (id: ImageId) => imageManifest[id];

export type WeddingData = typeof weddingData;
