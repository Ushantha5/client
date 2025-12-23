// services/greeting.service.ts
import { LocationData } from "./location.service";

export interface Greeting {
  primary?: string;        // Primary language text (e.g., Tamil script, Sinhala script) - made optional
  transliteration?: string; // Romanized version for pronunciation (made optional)
  english: string;        // English translation
  language: "tamil" | "sinhala" | "english";
  timeOfDay: "morning" | "afternoon" | "evening" | "default";
}

// Tamil greetings (for Tamil Nadu and Tamil regions)
const TAMIL_GREETINGS = {
  morning: {
    primary: "காலை வணக்கம்",
    transliteration: "Kalai Vanakkam",
    english: "Good Morning"
  },
  afternoon: {
    primary: "மதிய வணக்கம்",
    transliteration: "Mathiya Vanakkam",
    english: "Good Afternoon"
  },
  evening: {
    primary: "மாலை வணக்கம்",
    transliteration: "Maalai Vanakkam",
    english: "Good Evening"
  },
  default: {
    primary: "வணக்கம்",
    transliteration: "Vanakkam",
    english: "Hello / Welcome"
  }
};

// Special Tamil greetings for Tamil Nadu users (slightly different transliterations)
const TAMIL_NADU_GREETINGS = {
  morning: {
    primary: "காலை வணக்கம்",
    transliteration: "Kalai Vanakkam",
    english: "Good Morning"
  },
  afternoon: {
    primary: "மதிய வணக்கம்",
    transliteration: "Mathiya Vanakkam",
    english: "Good Afternoon"
  },
  evening: {
    primary: "மாலை வணக்கம்",
    transliteration: "Maalai Vanakkam",
    english: "Good Evening"
  },
  default: {
    primary: "வணக்கம்",
    transliteration: "Vanakkam",
    english: "Hello / Welcome"
  }
};

// Sinhala greetings (for Sri Lankan users)
const SINHALA_GREETINGS = {
  morning: {
    primary: "සුබ උදේසනක්",
    transliteration: "Subha udhasanak",
    english: "Good Morning"
  },
  afternoon: {
    primary: "සුබ දවලක්",
    transliteration: "Subha dhavalak",
    english: "Good Afternoon"
  },
  evening: {
    primary: "සුබ සවසක්",
    transliteration: "Subha savasak",
    english: "Good Evening"
  },
  default: {
    primary: "ආයුබෝවන්",
    transliteration: "Ayubowan",
    english: "Hello / Welcome"
  }
};

/**
 * Get the appropriate greeting based on time of day and user location
 */
export function getGreeting(date: Date = new Date(), location: LocationData): Greeting {
  const hour = date.getHours();
  let greetings;
  let language: "tamil" | "sinhala" | "english" = "english";

  // Select appropriate greeting set based on location
  if (location.isTamilRegion) {
    // Tamil-speaking regions in Sri Lanka
    greetings = TAMIL_GREETINGS;
    language = "tamil";
  } else if (location.isTamilNadu) {
    // Tamil Nadu, India
    greetings = TAMIL_NADU_GREETINGS;
    language = "tamil";
  } else if (location.isSriLanka) {
    // Other parts of Sri Lanka
    greetings = SINHALA_GREETINGS;
    language = "sinhala";
  } else {
    // Default to Tamil greetings for general users
    greetings = TAMIL_GREETINGS;
    language = "tamil";
  }

  // Determine time of day
  let timeOfDay: "morning" | "afternoon" | "evening" | "default" = "default";

  // Morning: 5am - 12pm
  if (hour >= 5 && hour < 12) {
    timeOfDay = "morning";
  }
  // Afternoon: 12pm - 5pm
  else if (hour >= 12 && hour < 17) {
    timeOfDay = "afternoon";
  }
  // Evening: 5pm - 9pm
  else if (hour >= 17 && hour < 21) {
    timeOfDay = "evening";
  }

  return {
    ...greetings[timeOfDay],
    language,
    timeOfDay
  };
}

/**
 * Get greeting text for text-to-speech
 * Returns the greeting in a format suitable for TTS
 */
export function getGreetingForTTS(date: Date = new Date(), location: LocationData): string {
  const greeting = getGreeting(date, location);

  // Return transliteration for TTS (more compatible with most TTS engines)
  // Format: "Greeting! Welcome to MR5 School."
  return `${greeting.transliteration}! Welcome to MR5 School. set Relax.`;
}

/**
 * Get the full welcome message with user name
 */
export function getPersonalizedGreeting(
  userName: string | undefined,
  date: Date = new Date(),
  location: LocationData
): string {
  const greeting = getGreeting(date, location);
  const nameSegment = userName ? `, ${userName}` : "";

  return `${greeting.transliteration}${nameSegment}! Welcome to MR5 School.`;
}