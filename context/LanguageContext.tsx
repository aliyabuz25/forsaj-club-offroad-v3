import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

export type Language = 'AZ' | 'EN' | 'RU' | 'TR';

interface TranslationItem {
    id: string;
    key: string;
    AZ: string;
    EN: string;
    RU: string;
    TR?: string;
}

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, defaultValue?: string) => string;
    translateText: (text: string) => Promise<string>;
    refreshContent: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLangState] = useState<Language>(() => {
        const saved = localStorage.getItem('forsaj_lang');
        if (saved && ['AZ', 'EN', 'RU', 'TR'].includes(saved)) return saved as Language;
        return 'AZ';
    });

    const [contentMap, setContentMap] = useState<{ [key: string]: string }>({});
    const [translations, setTranslations] = useState<TranslationItem[]>([]);
    const [translationCache, setTranslationCache] = useState<{ [key: string]: string }>({});

    const refreshContent = async () => {
        const safeFetch = async (url: string) => {
            try {
                const res = await fetch(url);
                if (!res.ok) return null;
                return await res.json();
            } catch (e) {
                return null;
            }
        };

        const [cont, trans] = await Promise.all([
            safeFetch('/api/content'),
            safeFetch('/api/translations')
        ]);

        if (cont && Array.isArray(cont)) {
            const map: { [key: string]: string } = {};
            cont.forEach(item => { if (item.key) map[item.key] = item.value; });
            setContentMap(map);
        }

        if (trans && Array.isArray(trans)) {
            setTranslations(trans);
        }
    };

    useEffect(() => {
        refreshContent();
    }, []);

    const setLanguage = (lang: Language) => {
        localStorage.setItem('forsaj_lang', lang);
        setLangState(lang);
        window.location.reload();
    };

    // HIGH-QUALITY DYNAMIC TRANSLATOR (Using internal proxy - stable & unlimited)
    const translateText = useCallback(async (text: string): Promise<string> => {
        if (!text || language === 'AZ') return text;

        const cacheKey = `${language}:${text}`;
        if (translationCache[cacheKey]) return translationCache[cacheKey];

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    targetLang: language.toLowerCase()
                })
            });
            const data = await response.json();

            if (data && data.translatedText) {
                setTranslationCache(prev => ({ ...prev, [cacheKey]: data.translatedText }));
                return data.translatedText;
            }
            return text;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    }, [language, translationCache]);

    const t = (key: string, defaultValue?: string): string => {
        // 1. Static translations from JSON
        const transItem = translations.find(item => item.key === key);
        if (transItem) {
            const val = transItem[language];
            if (val) return val;
            if (transItem.AZ) return transItem.AZ;
        }

        // 2. Content overrides
        if (language === 'AZ' && contentMap[key]) return contentMap[key];

        // 3. Fallback
        return defaultValue || key.split('.').pop()?.toUpperCase() || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, translateText, refreshContent }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
