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
        // First check Weglot current language if available via cookie or session
        const wgLang = document.cookie.split('; ').find(row => row.startsWith('wg-lang='))?.split('=')[1];
        if (wgLang) {
            const code = wgLang.toUpperCase();
            if (['AZ', 'EN', 'RU', 'TR'].includes(code)) return code as Language;
        }
        return 'AZ';
    });
    const [contentMap, setContentMap] = useState<{ [key: string]: string }>({});
    const [translations, setTranslations] = useState<TranslationItem[]>([]);

    // Fetch initial content mapping to allow dynamic AZ text editing
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
        const syncWeglot = () => {
            const wag = (window as any).Weglot;
            if (wag && typeof wag.getCurrentLang === 'function') {
                const current = wag.getCurrentLang().toUpperCase();
                if (['AZ', 'EN', 'RU', 'TR'].includes(current) && current !== language) {
                    setLangState(current as Language);
                }
            }
        };

        const interval = setInterval(syncWeglot, 1000);
        return () => clearInterval(interval);
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
        const target = lang.toLowerCase();
        const wag = (window as any).Weglot;

        if (wag && typeof wag.switchTo === 'function') {
            try {
                wag.switchTo(target);
                setLangState(lang);
            } catch (e) {
                console.error('Weglot switch error:', e);
                window.location.reload();
            }
        } else {
            // Fallback: reload might trigger Weglot on next load if state is saved
            setLangState(lang);
            window.location.reload();
        }
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
