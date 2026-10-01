/**
 * HINDI EXPERIMENT — all language-specific text lives here.
 *
 *  - `translations` : interface strings that were hard-coded in components
 *                     (buttons, labels, countdown units, screen-reader text).
 *  - `hindiContent` : the Hindi invitation copy. It mirrors the shape of
 *                     `weddingData` and only lists what differs; any field left
 *                     out (or empty) falls back to the English original in
 *                     src/data/weddingData.ts.
 *
 * The Hindi is written as wedding-card copy in its own right (approved
 * sample), not translated line by line from the English.
 *
 * Kept exactly as written in both languages: Dr. Rahul, Sweta, family names,
 * venue names, addresses, Google Maps links and calendar entries.
 */

export const translations = {
  en: {
    languageLabel: "Language",
    scrollToBegin: "Scroll to begin",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    navLabel: "Invitation sections",
    navInvitation: "Invitation",
    invitationDialog: (title: string) => `${title} — wedding invitation`,
    coupleAria: (groom: string, bride: string) => `${groom} and ${bride}`,
    envelopeHint: "Tap the seal to open",
    envelopeBlessings: "With the blessings of our families",
    familiesHeadingA: "With the Blessings",
    familiesHeadingB: "of Our Families",
    /** Hindi uses its own complete sentence here; English builds it from data. */
    familiesSentence: "",
    familiesIntroEnd: ".",
    timeLabel: "Time",
    venueLabel: "Venue",
    detailsOf: (name: string) => `${name} details`,
    directionsTo: (name: string) => `Directions to ${name} (opens Google Maps)`,
    opensMaps: "(opens Google Maps)",
    addToCalendar: "Add to Calendar",
    addEventToCalendar: (name: string) => `Add ${name} to calendar`,
    googleCalendar: "Google Calendar",
    appleOutlook: "Apple / Outlook (.ics)",
    playMusic: "Play music",
    muteMusic: "Mute music",
    timerLabel: "Time until the wedding",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
  },
  hi: {
    languageLabel: "भाषा",
    scrollToBegin: "आगे पढ़ें",
    menu: "मेन्यू",
    openMenu: "मेन्यू खोलें",
    closeMenu: "मेन्यू बंद करें",
    navLabel: "निमंत्रण के भाग",
    navInvitation: "निमंत्रण",
    invitationDialog: (title: string) => `${title} — शुभ विवाह निमंत्रण`,
    coupleAria: (groom: string, bride: string) => `${groom} संग ${bride}`,
    envelopeHint: "निमंत्रण खोलने के लिए मुहर छुएँ",
    envelopeBlessings: "परिवारजनों के आशीर्वाद से",
    familiesHeadingA: "बड़ों के",
    familiesHeadingB: "आशीर्वाद से",
    familiesSentence: "Dr. Rahul और Sweta के शुभ विवाह में आपकी गरिमामयी उपस्थिति प्रार्थनीय है।",
    familiesIntroEnd: "।",
    timeLabel: "समय",
    venueLabel: "स्थान",
    detailsOf: (name: string) => `${name} का विवरण`,
    directionsTo: (name: string) => `${name} का रास्ता (Google Maps में खुलेगा)`,
    opensMaps: "(Google Maps में खुलेगा)",
    addToCalendar: "कैलेंडर में जोड़ें",
    addEventToCalendar: (name: string) => `${name} को कैलेंडर में जोड़ें`,
    googleCalendar: "Google Calendar",
    appleOutlook: "Apple / Outlook (.ics)",
    playMusic: "संगीत चलाएँ",
    muteMusic: "संगीत बंद करें",
    timerLabel: "विवाह की शुभ घड़ी में शेष समय",
    days: "दिन",
    hours: "घंटे",
    minutes: "मिनट",
    seconds: "सेकंड",
  },
} as const;

export type UIStrings = { [K in keyof (typeof translations)["en"]]: (typeof translations)["en"][K] extends (...a: infer A) => string ? (...a: A) => string : string };

/** Hindi invitation copy (same shape as weddingData; omitted fields fall back to English). */
export const hindiContent = {
  couple: {
    title: "Dr. Rahul संग Sweta",
    date: "12 दिसंबर 2026",
  },
  invitation: {
    cordially: "आप सपरिवार सादर आमंत्रित हैं",
    weds: "संग",
    openButton: "निमंत्रण खोलें",
  },
  story: {
    eyebrow: "हमारा सफ़र",
    titleA: "दो दिल,",
    titleB: "एक नई शुरुआत",
    groomLabel: "वर",
    brideLabel: "वधू",
  },
  families: {
    heading: "बड़ों के आशीर्वाद से",
    groom: { label: "वर पक्ष", fatherTitle: "सेवानिवृत्त प्राचार्य" },
    bride: { label: "वधू पक्ष", grandfatherTitle: "दादाजी" },
  },
  celebrations: {
    eyebrow: "रस्मों और खुशियों से सजे तीन दिन",
    heading: "विवाह समारोह",
    weddingEyebrow: "शुभ विवाह",
  },
  events: {
    chheka: {
      name: "छेका",
      date: "09 दिसंबर 2026",
      weekday: "बुधवार",
      time: "शाम 6:00 बजे",
    },
    matkor: {
      name: "मटकोर",
      date: "10 दिसंबर 2026",
      weekday: "गुरुवार",
      time: "शाम 6:00 बजे से",
      venue: "निवास पर",
    },
    vivah: {
      name: "विवाह",
      date: "12 दिसंबर 2026",
      weekday: "शनिवार",
      time: "शाम 6:00 बजे से",
    },
  },
  venue: {
    directionsLabel: "रास्ता देखें",
  },
  countdown: {
    heading: "शुभ मिलन की घड़ी अब करीब है",
    caption: "12 दिसंबर 2026 · शाम 6:00 बजे से",
    arrived: "आज वो शुभ घड़ी आ गई",
  },
  images: {
    hero: { alt: "मंच पर हाथ जोड़कर अतिथियों का स्वागत करते Dr. Rahul और Sweta का चित्र" },
    heroMobile: { alt: "मंच पर हाथ जोड़कर अतिथियों का स्वागत करते Dr. Rahul और Sweta का चित्र" },
    story: { alt: "सीढ़ियों पर खड़ी Sweta को मुस्कुराकर देखते Dr. Rahul का चित्र" },
    wedding: { alt: "Sweta के कंधे पर हाथ रखे, एक-दूसरे को देखकर मुस्कुराते Dr. Rahul और Sweta का चित्र" },
    closing: { alt: "विवाह परिधान में साथ खड़े Dr. Rahul और Sweta का चित्र" },
  },
  final: {
    heading: "हार्दिक आभार",
    message: "आपके आने से ही हमारी खुशियाँ पूरी होंगी।",
  },
  navigation: {
    story: "हमारा सफ़र",
    family: "परिवार",
    celebrations: "विवाह समारोह",
    wedding: "शुभ विवाह",
    countdown: "शुभ घड़ी",
  },
} as const;
