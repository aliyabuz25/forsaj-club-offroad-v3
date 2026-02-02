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

    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
    };

    const setCookie = (name: string, value: string) => {
        const date = new Date();
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        const expires = "; expires=" + date.toUTCString();

        // Simple cookie setting for max compatibility
        document.cookie = name + "=" + (value || "") + expires + "; path=/";

        // If not on localhost, try to set it for the base domain as well
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && !/^[0-9.]+$/.test(hostname)) {
            const parts = hostname.split('.');
            if (parts.length >= 2) {
                const baseDomain = parts.slice(-2).join('.');
                document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=." + baseDomain;
            }
        }
    };

    const deleteCookie = (name: string) => {
        const expires = "; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = name + "=; path=/; " + expires;

        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && !/^[0-9.]+$/.test(hostname)) {
            const parts = hostname.split('.');
            if (parts.length >= 2) {
                const baseDomain = parts.slice(-2).join('.');
                document.cookie = name + "=; path=/; domain=." + baseDomain + "; " + expires;
            }
        }
    };

    useEffect(() => {
        const checkGTranslateStatus = () => {
            const googtrans = getCookie('googtrans');
            if (googtrans) {
                const langCode = googtrans.split('/').pop()?.toUpperCase();
                if (['AZ', 'EN', 'RU', 'TR'].includes(langCode || '')) {
                    if (language !== langCode) setLangState(langCode as Language);
                }
            } else if (language !== 'AZ') {
                setLangState('AZ');
            }
        };

        const interval = setInterval(checkGTranslateStatus, 2000);
        return () => clearInterval(interval);
    }, [language]);

    const setLanguage = (lang: Language) => {
        const target = lang.toLowerCase();
        const pair = `az|${target}`;

        // Use the standard GTranslate switcher
        if (typeof (window as any).doGTranslate === 'function') {
            (window as any).doGTranslate(pair);
            setLangState(lang);
        } else {
            // Fallback via cookie + reload
            if (lang === 'AZ') {
                deleteCookie('googtrans');
            } else {
                setCookie('googtrans', `/az/${target}`);
            }
            setLangState(lang);
            window.location.reload();
        }
    };

    const t = (key: string, defaultValue?: string): string => {
        if (language === 'AZ' && contentMap[key]) return contentMap[key];
        const transItem = translations.find(t => t.key === key);
        if (transItem) {
            const val = transItem[language];
            if (val) return val;
            if (transItem.AZ) return transItem.AZ;
        }
        return defaultValue || key.split('.').pop()?.toUpperCase() || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, refreshContent }}>
            <div className="gtranslate_wrapper" style={{ display: 'none' }}></div>
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
