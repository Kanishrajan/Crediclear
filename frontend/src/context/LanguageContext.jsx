import { createContext, useContext, useState } from 'react';
import en from '../locales/en/translation';
import ta from '../locales/ta/translation';
import hi from '../locales/hi/translation';

const translations = { en, ta, hi };

export const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('en');
    const t = translations[lang] || translations.en;

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
    return ctx;
}
