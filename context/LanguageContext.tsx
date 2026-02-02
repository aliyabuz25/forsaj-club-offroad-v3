import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import toast from 'react-hot-toast';

export type Language = 'AZ' | 'EN' | 'RU' | 'TR';

interface Translations {
    [key: string]: {
        AZ: string;
        EN: string;
        RU: string;
    };
}



interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLangState] = useState<Language>('AZ');
    const [contentMap, setContentMap] = useState<{ [key: string]: string }>({});

    // Fetch initial content mapping to allow dynamic AZ text editing
    const refreshContent = () => {
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
    };

    useEffect(() => {
        refreshContent();
    }, []);

    // Helper to get cookie value
    const getCookie = (name: string) => {
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        const prefix = name + "=";
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(prefix) === 0) return c.substring(prefix.length, c.length);
        }
        return null;
    };

    useEffect(() => {
        const syncLanguageFromCookie = () => {
            const googtrans = getCookie('googtrans');
            if (googtrans) {
                const parts = googtrans.split('/');
                const langCode = parts[parts.length - 1].toUpperCase();
                if (['AZ', 'EN', 'RU', 'TR'].includes(langCode)) {
                    setLangState(langCode as Language);
                    return;
                }
            }
            // Default if no cookie
            setLangState('AZ');
        };

        syncLanguageFromCookie();

        // Listen for cookie changes potentially from other scripts
        const interval = setInterval(syncLanguageFromCookie, 2000);
        return () => clearInterval(interval);
    }, []);

    // Brand & Native protection: When AZ is selected, tell the browser/CDN NOT to translate anything.
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

        if (target === 'az') {
            // Revert to original: Clear all possible translation cookies
            const expires = "Thu, 01 Jan 1970 00:00:00 UTC";
            const domain = window.location.hostname === 'localhost' ? '' : `; domain=.${window.location.hostname}`;

            document.cookie = `googtrans=; expires=${expires}; path=/`;
            document.cookie = `googtrans=; expires=${expires}; path=/;${domain}`;

            setLangState('AZ');
            window.location.reload();
            return;
        }

        const cookieValue = `/az/${target}`;

        // Comprehensive cookie setting for translations
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString(); // 30 days
        const domain = window.location.hostname === 'localhost' ? '' : `; domain=.${window.location.hostname}`;

        const cookieString = `googtrans=${cookieValue}; expires=${expires}; path=/;${domain}`;
        document.cookie = cookieString;
        document.cookie = `googtrans=${cookieValue}; expires=${expires}; path=/`;

        setLangState(lang);

        // Immediate GTranslate trigger if available
        if (typeof (window as any).doGTranslate === 'function') {
            try {
                (window as any).doGTranslate(`az|${target}`);
                // Small delay then reload to ensure full DOM translation stability
                setTimeout(() => window.location.reload(), 150);
            } catch (e) {
                window.location.reload();
            }
        } else {
            window.location.reload();
        }
    };

    // The CDN handles DOM translation. t() now looks up from database or falls back to hardcoded default.
    const t = (key: string, defaultValue?: string): string => {
        // 1. Check if the user has customized this text in the Admin Panel (content.json)
        if (contentMap[key]) return contentMap[key];

        // 2. Fallback to the hardcoded default provided in the component
        if (defaultValue) return defaultValue;

        // 3. Last resort: showing a cleaned up key
        return key.split('.').pop()?.toUpperCase() || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {/* GTranslate hidden container */}
            <div className="gtranslate_wrapper notranslate" style={{ display: 'none' }}></div>
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
