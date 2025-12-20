import type { Config } from "tailwindcss"

const config = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "oklch(var(--border) / <alpha-value>)",
                input: "oklch(var(--input) / <alpha-value>)",
                ring: "oklch(var(--ring) / <alpha-value>)",
                background: "oklch(var(--bg-app) / <alpha-value>)",
                foreground: "oklch(var(--foreground) / <alpha-value>)",
                primary: {
                    DEFAULT: "oklch(var(--primary) / <alpha-value>)",
                    foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
                },
                secondary: {
                    DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
                    foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
                },
                destructive: {
                    DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
                    foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
                },
                muted: {
                    DEFAULT: "oklch(var(--muted) / <alpha-value>)",
                    foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
                },
                accent: {
                    DEFAULT: "oklch(var(--accent) / <alpha-value>)",
                    foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
                },
                popover: {
                    DEFAULT: "oklch(var(--popover) / <alpha-value>)",
                    foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
                },
                card: {
                    DEFAULT: "oklch(var(--card) / <alpha-value>)",
                    foreground: "oklch(var(--card-foreground) / <alpha-value>)",
                },
                // Huly Specific Semantic Colors
                surface: {
                    DEFAULT: "oklch(var(--bg-surface) / <alpha-value>)",
                    highlight: "oklch(var(--bg-surface-highlight) / <alpha-value>)",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "spotlight": {
                    "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
                    "100%": { opacity: "1", transform: "translate(-50%,-40%) scale(1)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "spotlight": "spotlight 2s ease .75s 1 forwards",
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
                'spotlight-gradient': 'radial-gradient(circle at center, var(--primary-channel) 0%, transparent 70%)',
            }
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/typography"),
    ],
} satisfies Config

export default config
