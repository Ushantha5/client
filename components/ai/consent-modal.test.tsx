import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AIConsentModal } from './consent-modal';

expect.extend(toHaveNoViolations);

// Mock the Dialog component rendering since Radix uses Portals which can be tricky in tests
// For accessibility testing of the *content*, we mainly check if proper attributes are generated
// But jest-axe checks the rendered DOM.
// We need to ensure the Dialog is "open" for it to render.

describe('AIConsentModal', () => {
    // Mock localStorage to ensure the modal opens
    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => null),
                setItem: jest.fn(),
            },
            writable: true
        });

        // Mock setTimeout to run immediately or wait
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should have no accessibility violations when open', async () => {
        const { container, baseElement } = render(<AIConsentModal />);

        // Fast-forward timers to trigger setOpen(true)
        jest.runAllTimers();

        // Radix Dialog renders into a portal usually, but jest-dom usually handles it.
        // We run axe on the baseElement to catch the portal content.
        const results = await axe(baseElement);

        expect(results).toHaveNoViolations();
    });
});
