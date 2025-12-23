import { useRegionalSettings } from "@/contexts/RegionalSettingsContext";
import { translations } from "@/lib/translations";

export function useTranslation() {
    const { settings } = useRegionalSettings();
    const rawLang = settings?.language || 'en';
    const language = rawLang.includes(',')
        ? rawLang.split(',')[0].trim().substring(0, 2).toLowerCase()
        : (rawLang.length > 2 ? rawLang.substring(0, 2).toLowerCase() : rawLang.toLowerCase());

    const t = (key: string) => {
        const langDict = translations[language] || translations['en'];
        return langDict[key] || key;
    };

    return { t, language };
}
