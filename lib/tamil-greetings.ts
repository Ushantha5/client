/**
 * Tamil Greeting Utilities
 * 
 * Provides time-based Tamil greetings for the Welcome Avatar
 * Supports localization for Tamil Nadu users
 * Now integrated with the multilingual greeting service
 */

import { LocationData } from "@/services/location.service";
import { Greeting } from "@/services/greeting.service";

export type TamilGreeting = Greeting;

// Standard greetings for general users
const STANDARD_GREETINGS = {
  morning: {
    primary: "காலை வணக்கம்",
    english: "Good Morning"
  },
  afternoon: {
    english: "Good Afternoon"
  },
  evening: {
    english: "Good Evening"
  },
  default: {
    english: "Hello / Welcome"
  }
};

// Special greetings for Tamil Nadu users
const TAMIL_NADU_GREETINGS = {
  morning: {
    english: "Good Morning"
  },
  afternoon: {
    english: "Good Afternoon"
  },
  evening: {
    english: "Good Evening"
  },
  default: {
    english: "Hello / Welcome"
  }
};

/**
 * Get the appropriate Tamil greeting based on current time and user location
 * 
 * | Time Range | Tamil | English |
 * |------------|-------|---------|
 * | 5am - 12pm  | Good Morning |
 * | 12pm - 5pm  | Good Afternoon |
 * | 5pm - 9pm   | Good Evening |
 * | Other       | Hello/Welcome |
 */
export function getTamilGreeting(date: Date = new Date(), location: LocationData | boolean = false): TamilGreeting {
  // Handle legacy boolean parameter
  const locationData: LocationData = typeof location === 'boolean' 
    ? { 
        country: "", 
        region: "", 
        city: "", 
        latitude: null, 
        longitude: null, 
        isTamilNadu: location, 
        isSriLanka: false, 
        isTamilRegion: false 
      } 
    : location;

  const hour = date.getHours();
  const isTamilNaduUser = locationData.isTamilNadu;
  const greetings = isTamilNaduUser ? TAMIL_NADU_GREETINGS : STANDARD_GREETINGS;

  // Morning: 5am - 12pm
  if (hour >= 5 && hour < 12) {
    return {
      ...greetings.morning,
      language: "tamil",
      timeOfDay: "morning",
    };
  }

  // Afternoon: 12pm - 5pm
  if (hour >= 12 && hour < 17) {
    return {
      ...greetings.afternoon,
      language: "tamil",
      timeOfDay: "afternoon",
    };
  }

  // Evening: 5pm - 9pm
  if (hour >= 17 && hour < 21) {
    return {
      ...greetings.evening,
      language: "tamil",
      timeOfDay: "evening",
    };
  }

  // Default (night or early morning)
  return {
    ...greetings.default,
    language: "tamil",
    timeOfDay: "default",
  };
}

/**
 * Get greeting text for text-to-speech
 * Returns the greeting in a format suitable for TTS
 */
export function getGreetingForTTS(date: Date = new Date(), location: LocationData | boolean = false): string {
  const locationData: LocationData = typeof location === 'boolean' 
    ? { 
        country: "", 
        region: "", 
        city: "", 
        latitude: null, 
        longitude: null, 
        isTamilNadu: location, 
        isSriLanka: false, 
        isTamilRegion: false 
      } 
    : location;
    
  const greeting = getTamilGreeting(date, locationData);
  
  // Return transliteration for TTS (more compatible with most TTS engines) or fallback to english
  // Format: "Greeting! Welcome to MR5 School."
  const greetingText = greeting.transliteration || greeting.primary || greeting.english;
  return `${greetingText}! Welcome to MR5 School. I am your AI learning assistant.`;
}

/**
 * Get the full welcome message with user name
 */
export function getPersonalizedGreeting(
  userName?: string,
  date: Date = new Date(),
  location: LocationData | boolean = false
): string {
  const locationData: LocationData = typeof location === 'boolean' 
    ? { 
        country: "", 
        region: "", 
        city: "", 
        latitude: null, 
        longitude: null, 
        isTamilNadu: location, 
        isSriLanka: false, 
        isTamilRegion: false 
      } 
    : location;
    
  const greeting = getTamilGreeting(date, locationData);
  const nameSegment = userName ? `, ${userName}` : "";
  
  const greetingText = greeting.transliteration || greeting.primary || greeting.english;
  return `${greetingText}${nameSegment}! Welcome to MR5 School.`;
}

/**
 * Animation states for the avatar greeting gesture
 */
export type AvatarGestureState =
  | "idle"
  | "greeting_start"    // Hands coming together
  | "greeting_hold"     // Hands clasped (Namaste pose)
  | "greeting_end"      // Hands returning
  | "speaking"
  | "listening";

/**
 * Get CSS animation class for gesture state
 */
export function getGestureAnimationClass(state: AvatarGestureState): string {
  const animations: Record<AvatarGestureState, string> = {
    idle: "animate-idle",
    greeting_start: "animate-greeting-in",
    greeting_hold: "animate-greeting-hold",
    greeting_end: "animate-greeting-out",
    speaking: "animate-speaking",
    listening: "animate-listening",
  };

  return animations[state] || "";
}
