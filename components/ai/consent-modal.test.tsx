/* eslint-env jest */
import React from 'react';
import { render, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AIConsentModal } from './consent-modal';

describe('AIConsentModal', () => {
    beforeEach(() => {
        // Mock localStorage
        const localStorageMock = (() => {
            let store: Record<string, string> = {};
            return {
                getItem: (key: string) => store[key] || null,
                setItem: (key: string, value: string) => { store[key] = value; },
                clear: () => { store = {}; }
            };
        })();
        Object.defineProperty(window, 'localStorage', { value: localStorageMock, configurable: true });

        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should show the modal after a delay', async () => {
        render(<AIConsentModal />);

        // Initially it should not be in the document
        expect(screen.queryByText(/AI-Powered Learning/i)).not.toBeInTheDocument();

        // Advance timers
        act(() => {
            jest.advanceTimersByTime(1500);
        });

        // Now it should be visible
        expect(screen.getByText(/AI-Powered Learning/i)).toBeInTheDocument();
    });

    it('should close when "Maybe Later" is clicked', async () => {
        render(<AIConsentModal />);

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        const closeButton = screen.getByText(/Maybe Later/i);
        act(() => {
            closeButton.click();
        });

        // It might take a moment to disappear due to animations, but the 'open' state should be false
        // Radix DialogContent should be gone
        expect(screen.queryByText(/AI-Powered Learning/i)).not.toBeInTheDocument();
    });
});
