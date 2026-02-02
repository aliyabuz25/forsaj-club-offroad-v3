import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
    refreshContent: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLangState] = useState<Language>(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };
        const googtrans = getCookie('googtrans');
        if (googtrans) {
            const langCode = googtrans.split('/').pop()?.toUpperCase();
            if (['AZ', 'EN', 'RU', 'TR'].includes(langCode || '')) return langCode as Language;
        }
        return 'AZ';
    });
    const [contentMap, setContentMap] = useState<{ [key: string]: string }>({});
    const [translations, setTranslations] = useState<TranslationItem[]>([]);

    // Fetch initial content mapping to allow dynamic AZ text editing
    const refreshContent = () => {
        // Load content (AZ overrides)
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const map: { [key: string]: string } = {};
                    data.forEach(item => {
                        if (item.key) map[item.key] = item.value;
                    });
                    setContentMap(map);
                }
            })
            .catch(err => console.error('Failed to load content', err));

        // Load static translations (Multi-lang support)
        fetch('/api/translations')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTranslations(data);
                }
            })
            .catch(err => console.error('Failed to load translations', err));
    };

    useEffect(() => {
        refreshContent();
    }, []);

    // Helper to get cookie value
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
    };

    const setCookie = (name: string, value: string) => {
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
        if (window.location.hostname !== 'localhost') {
            const domainParts = window.location.hostname.split('.');
            if (domainParts.length >= 2) {
                const baseDomain = domainParts.slice(-2).join('.');
                document.cookie = `${name}=${value}; expires=${expires}; path=/; domain=.${baseDomain}`;
            }
        }
    };

    const deleteCookie = (name: string) => {
        const expires = "Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = `${name}=; expires=${expires}; path=/`;
        if (window.location.hostname !== 'localhost') {
            const domainParts = window.location.hostname.split('.');
            if (domainParts.length >= 2) {
                const baseDomain = domainParts.slice(-2).join('.');
                document.cookie = `${name}=; expires=${expires}; path=/; domain=.${baseDomain}`;
            }
        }
    };

    useEffect(() => {
        const googtrans = getCookie('googtrans');
        if (googtrans) {
            const langCode = googtrans.split('/').pop()?.toUpperCase();
            if (['AZ', 'EN', 'RU', 'TR'].includes(langCode || '')) {
                if (language !== langCode) setLangState(langCode as Language);
            }
        } else {
            if (language !== 'AZ') setLangState('AZ');
        }
    }, [language]);

    // Brand & Native protection
    useEffect(() => {
        const isAZ = language === 'AZ';
        if (isAZ) {
            document.documentElement.classList.add('notranslate');
            document.documentElement.setAttribute('translate', 'no');
        } else {
            document.documentElement.classList.remove('notranslate');
            document.documentElement.removeAttribute('translate');
        }
    }, [language]);

    const setLanguage = (lang: Language) => {
        if (lang === 'AZ') {
            deleteCookie('googtrans');
        } else {
            setCookie('googtrans', `/az/${lang.toLowerCase()}`);
        }
        setLangState(lang);
        setTimeout(() => window.location.reload(), 100);
    };

    const t = (key: string, defaultValue?: string): string => {
        // 1. Check if user has customized this text in content.json (highest priority for current lang)
        // Usually contentMap is used for AZ text.
        if (language === 'AZ' && contentMap[key]) return contentMap[key];

        // 2. Lookup in translations.json
        const transItem = translations.find(t => t.key === key);
        if (transItem) {
            const val = transItem[language];
            if (val) return val;
            // Fallback to AZ if current lang translation is missing
            if (transItem.AZ) return transItem.AZ;
        }

        // 3. Fallback to default value
        if (defaultValue) return defaultValue;

        // 4. Last resort
        return key.split('.').pop()?.toUpperCase() || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, refreshContent }}>
            <div id="google_translate_element" style={{ display: 'none' }}></div>
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
