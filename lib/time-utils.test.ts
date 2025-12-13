import { getTimeBasedGreeting } from './time-utils';

describe('getTimeBasedGreeting', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('returns "Good morning" between 5:00 and 11:59', () => {
        const morning = new Date('2023-01-01T09:00:00');
        jest.setSystemTime(morning);
        expect(getTimeBasedGreeting()).toBe('Good morning');
    });

    it('returns "Good afternoon" between 12:00 and 16:59', () => {
        const afternoon = new Date('2023-01-01T14:00:00');
        jest.setSystemTime(afternoon);
        expect(getTimeBasedGreeting()).toBe('Good afternoon');
    });

    it('returns "Good evening" between 17:00 and 20:59', () => {
        const evening = new Date('2023-01-01T19:00:00');
        jest.setSystemTime(evening);
        expect(getTimeBasedGreeting()).toBe('Good evening');
    });

    it('returns "Welcome back" at other times (late night/early morning)', () => {
        const night = new Date('2023-01-01T23:00:00');
        jest.setSystemTime(night);
        expect(getTimeBasedGreeting()).toBe('Welcome back');

        const earlyMorning = new Date('2023-01-01T03:00:00');
        jest.setSystemTime(earlyMorning);
        expect(getTimeBasedGreeting()).toBe('Welcome back');
    });
});
