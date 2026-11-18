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
 * In Hindi mode the names, venues and addresses are shown in Devanagari.
 * Google Maps links and calendar entries always use the English originals,
 * so they keep matching real map listings.
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
    coupleAria: (first: string, second: string) => `${first} and ${second}`,
    envelopeHint: "Tap the seal to open",
    envelopeBlessings: "With the blessings of our families",
    familiesHeadingA: "With the Blessings",
    familiesHeadingB: "of Our Families",
    nameJoin: "&",
    parentsJoin: "&",
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
    scrollToBegin: "आगे देखें",
    menu: "मेन्यू",
    openMenu: "मेन्यू खोलें",
    closeMenu: "मेन्यू बंद करें",
    navLabel: "निमंत्रण के भाग",
    navInvitation: "निमंत्रण",
    invitationDialog: (title: string) => `${title} — शुभ विवाह निमंत्रण`,
    coupleAria: (first: string, second: string) => `${first} संग ${second}`,
    envelopeHint: "निमंत्रण खोलने के लिए मुहर छुएँ",
    envelopeBlessings: "पूज्य बड़ों के आशीर्वाद से",
    familiesHeadingA: "पूज्य बड़ों के",
    familiesHeadingB: "आशीर्वाद से",
    nameJoin: "संग",
    parentsJoin: "एवं",
    timeLabel: "समय",
    venueLabel: "स्थान",
    detailsOf: (name: string) => `${name} का विवरण`,
    directionsTo: (name: string) => `${name} का मार्ग (गूगल मैप्स में खुलेगा)`,
    opensMaps: "(गूगल मैप्स में खुलेगा)",
    addToCalendar: "कैलेंडर में जोड़ें",
    addEventToCalendar: (name: string) => `${name} को कैलेंडर में जोड़ें`,
    googleCalendar: "Google Calendar",
    appleOutlook: "Apple / Outlook (.ics)",
    playMusic: "संगीत चलाएँ",
    muteMusic: "संगीत बंद करें",
    timerLabel: "शुभ विवाह की मंगल बेला में शेष समय",
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
    groom: "डॉ. राहुल",
    groomFirstName: "राहुल",
    bride: "श्‍वेता",
    title: "श्‍वेता संग डॉ. राहुल",
    date: "12 दिसंबर 2026",
    city: "छपरा, बिहार",
  },
  invitation: {
    cordially: "आप सपरिवार सादर आमंत्रित हैं",
    weds: "संग",
    openButton: "निमंत्रण खोलें",
  },
  story: {
    eyebrow: "शुभ परिणय",
    titleA: "दो परिवार,",
    titleB: "एक पावन बंधन",
    groomLabel: "चिरंजीवी",
    brideLabel: "आयुष्मती",
    brideParentsLabel: "सुपुत्री",
    groomParentsLabel: "सुपुत्र",
  },
  families: {
    heading: "पूज्य बड़ों के आशीर्वाद से",
    intro:
      "परमपिता परमेश्वर की असीम कृपा से श्री चंद्रशेखर सिंह एवं श्रीमती सविता देवी की सुपुत्री आयुष्मती श्‍वेता का शुभ विवाह चिरंजीवी डॉ. राहुल के साथ दिनांक 12 दिसंबर 2026 को सम्पन्न होना निश्चित हुआ है। इस मंगल बेला पर आप सपरिवार पधारकर नवदम्पति को अपना स्नेहिल आशीर्वाद प्रदान करें।",
    groom: {
      label: "वर पक्ष",
      father: "डॉ. बिरेन्द्र कुमार सिंह",
      fatherTitle: "सेवानिवृत्त प्राचार्य",
      mother: "श्रीमती रेणु सिंह",
    },
    bride: {
      label: "वधू पक्ष",
      grandfather: "स्व. नगनारायण सिंह",
      grandfatherTitle: "दादाजी",
      father: "श्री चंद्रशेखर सिंह",
      mother: "श्रीमती सविता देवी",
    },
  },
  celebrations: {
    eyebrow: "तीन दिवसीय मंगल उत्सव",
    heading: "वैवाहिक कार्यक्रम",
    weddingEyebrow: "शुभ विवाह",
  },
  events: {
    chheka: {
      name: "तिलक",
      date: "9 दिसंबर 2026",
      weekday: "बुधवार",
      time: "सायं 6 बजे",
      venue: "पवेलियन मैरिज हॉल एवं गेस्ट हाउस",
      location: "मढ़ौरा, बिहार",
      address: "मढ़ौरा–नेथुआ रोड, रिलायंस स्मार्ट पॉइंट के सामने, मढ़ौरा प्रधान डाकघर के पास, मॉर्टन कॉलोनी, शिलौरी, बिहार 841418",
    },
    matkor: {
      name: "मटकोर",
      date: "10 दिसंबर 2026",
      weekday: "गुरुवार",
      time: "सायं 6 बजे से",
      venue: "निज निवास पर",
      location: "छपरा, बिहार",
    },
    vivah: {
      name: "विवाह",
      date: "12 दिसंबर 2026",
      weekday: "शनिवार",
      time: "सायं 6 बजे से",
      venue: "जलसा पैलेस",
      location: "छपरा, बिहार",
      address: "एस.एच. 90, प्रभुनाथ नगर, रतनपुरा, छपरा, बिहार 841301",
    },
  },
  venue: {
    name: "जलसा पैलेस",
    addressLines: ["एस.एच. 90, प्रभुनाथ नगर,", "रतनपुरा, छपरा,", "बिहार 841301"],
    directionsLabel: "मार्ग देखें",
  },
  countdown: {
    heading: "शुभ घड़ी अब निकट है",
    caption: "12 दिसंबर 2026 · सायं 6 बजे से",
    arrived: "आज वह शुभ घड़ी आ गई है",
  },
  images: {
    hero: { alt: "मंच पर हाथ जोड़कर अतिथियों का स्वागत करते श्‍वेता और डॉ. राहुल का चित्र" },
    heroMobile: { alt: "मंच पर हाथ जोड़कर अतिथियों का स्वागत करते श्‍वेता और डॉ. राहुल का चित्र" },
    story: { alt: "सीढ़ियों पर खड़ी श्‍वेता को मुस्कुराकर देखते डॉ. राहुल का चित्र" },
    wedding: { alt: "श्‍वेता के कंधे पर हाथ रखे, एक-दूसरे को देखकर मुस्कुराते श्‍वेता और डॉ. राहुल का चित्र" },
    closing: { alt: "विवाह परिधान में साथ खड़े श्‍वेता और डॉ. राहुल का चित्र" },
  },
  final: {
    heading: "हार्दिक आभार",
    message: "आपकी गरिमामयी उपस्थिति से हमारे उत्सव की शोभा और बढ़ जाएगी।",
  },
  navigation: {
    story: "वर-वधू",
    family: "परिवार",
    celebrations: "कार्यक्रम",
    wedding: "शुभ विवाह",
    countdown: "शुभ घड़ी",
  },
} as const;
