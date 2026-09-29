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
    /** Rendered as one heading: "Two Souls, One Journey". */
    titleA: "Two Souls,",
    titleB: "One Journey",
    groomLabel: "The Groom",
    brideLabel: "The Bride",
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
    eyebrow: "Three days of blessings",
    heading: "The Celebrations",
    weddingEyebrow: "The Wedding",
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

  /** Illustrated artwork — never distorted; crops only trim empty paper. */
  images: {
    hero: img("illustrations/rahul-sweta-namaste", "Illustration of Dr. Rahul and Sweta greeting guests with folded hands on their flower-decked wedding stage"),
    heroMobile: img("illustrations/rahul-sweta-namaste-mobile", "Illustration of Dr. Rahul and Sweta greeting guests with folded hands on their flower-decked wedding stage"),
    story: img("illustrations/rahul-sweta-staircase", "Illustration of Dr. Rahul smiling up at Sweta as she stands on the staircase"),
    wedding: img("illustrations/rahul-sweta-embrace", "Illustration of Dr. Rahul with his hand on Sweta's shoulder as they smile at each other"),
    closing: img("illustrations/rahul-sweta-together", "Illustration of Dr. Rahul and Sweta standing together in their wedding attire"),
  },

  music: {
    /**
     * The couple's own instrumental track (no vocals). Re-encoded to 128 kbps
     * MP3 with short fades so the loop is seamless; the untouched original is
     * kept in assets/audio/. Loaded only after "Open Invitation" is tapped.
     */
    src: "/audio/royal-wedding-procession.mp3" as string | null,
    volume: 0.75,
    storageKey: "rw-music-muted",
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
    { id: "wedding", label: "The Wedding" },
    { id: "countdown", label: "Countdown" },
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
