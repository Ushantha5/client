// Mock the fetch API for testing
global.fetch = jest.fn();

import { getGreeting } from '../greeting.service';
import { DEFAULT_LOCATION } from '../location.service';

describe('Greeting Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getGreeting', () => {
    it('should return Tamil greeting for general users', () => {
      const date = new Date(2023, 5, 15, 10, 0, 0); // 10 AM
      const greeting = getGreeting(date, DEFAULT_LOCATION);
      
      expect(greeting.primary).toBe("காலை வணக்கம்");
      expect(greeting.transliteration).toBe("Kalai Vanakkam");
      expect(greeting.english).toBe("Good Morning");
      expect(greeting.language).toBe("tamil");
      expect(greeting.timeOfDay).toBe("morning");
    });

    it('should return Tamil Nadu specific greeting for Tamil Nadu users', () => {
      const date = new Date(2023, 5, 15, 14, 0, 0); // 2 PM
      const location = {
        ...DEFAULT_LOCATION,
        isTamilNadu: true
      };
      const greeting = getGreeting(date, location);
      
      expect(greeting.primary).toBe("மதிய வணக்கம்");
      expect(greeting.transliteration).toBe("Mathiya Vanakkam");
      expect(greeting.english).toBe("Good Afternoon");
      expect(greeting.language).toBe("tamil");
      expect(greeting.timeOfDay).toBe("afternoon");
    });

    it('should return Sinhala greeting for Sri Lankan users', () => {
      const date = new Date(2023, 5, 15, 19, 0, 0); // 7 PM
      const location = {
        ...DEFAULT_LOCATION,
        isSriLanka: true
      };
      const greeting = getGreeting(date, location);
      
      expect(greeting.primary).toBe("සුබ සවසක්");
      expect(greeting.transliteration).toBe("Subha savasak");
      expect(greeting.english).toBe("Good Evening");
      expect(greeting.language).toBe("sinhala");
      expect(greeting.timeOfDay).toBe("evening");
    });

    it('should return Tamil greeting for Tamil regions in Sri Lanka', () => {
      const date = new Date(2023, 5, 15, 22, 0, 0); // 10 PM (default)
      const location = {
        ...DEFAULT_LOCATION,
        isSriLanka: true,
        isTamilRegion: true
      };
      const greeting = getGreeting(date, location);
      
      expect(greeting.primary).toBe("வணக்கம்");
      expect(greeting.transliteration).toBe("Vanakkam");
      expect(greeting.english).toBe("Hello / Welcome");
      expect(greeting.language).toBe("tamil");
      expect(greeting.timeOfDay).toBe("default");
    });

    it('should return default greeting for night time', () => {
      const date = new Date(2023, 5, 15, 3, 0, 0); // 3 AM
      const greeting = getGreeting(date, DEFAULT_LOCATION);
      
      expect(greeting.primary).toBe("வணக்கம்");
      expect(greeting.transliteration).toBe("Vanakkam");
      expect(greeting.english).toBe("Hello / Welcome");
      expect(greeting.language).toBe("tamil");
      expect(greeting.timeOfDay).toBe("default");
    });
  });
});