import React, { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

export type Language = 'AZ' | 'EN' | 'RU';

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
    t: (key: string) => string;
    translations: Translations;
    updateTranslation: (key: string, values: { AZ: string, EN: string, RU: string }) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('AZ');
    const [translations, setTranslations] = useState<Translations>({});

    React.useEffect(() => {
        fetch('/api/translations')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const map: Translations = {};
                    data.forEach(item => {
                        map[item.key || item.id] = { AZ: item.AZ, EN: item.EN, RU: item.RU };
                    });
                    setTranslations(map);
                } else {
                    setTranslations(data);
                }
            });
    }, []);

    const [pendingTranslations, setPendingTranslations] = useState<Set<string>>(new Set());

    const t = (key: string): string => {
        // If we have the exact translation
        if (translations[key] && translations[key][language]) {
            return translations[key][language];
        }

        // Fallback to AZ (assuming key might be the text itself if not found in keys)
        const fallback = translations[key]?.AZ || key;

        // If we are not in AZ and translation is missing, try to auto-translate
        if (language !== 'AZ' && !pendingTranslations.has(`${key}_${language}`)) {
            // Mark as pending to avoid loops
            pendingTranslations.add(`${key}_${language}`);

            // Trigger translation
            fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: fallback, targetLang: language.toLowerCase() })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.translatedText) {
                        setTranslations(prev => ({
                            ...prev,
                            [key]: {
                                ...(prev[key] || { AZ: fallback, EN: '', RU: '' }),
                                [language]: data.translatedText
                            }
                        }));
                    }
                })
                .catch(() => {
                    // Ignore errors
                });
        }

        return fallback;
    };

    const updateTranslation = async (key: string, values: { AZ: string, EN: string, RU: string }) => {
        const updated = { ...translations, [key]: values };
        const res = await fetch('/api/translations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });
        if (res.ok) {
            setTranslations(updated);
            toast.success('Dil ayarları yeniləndi');
        } else {
            toast.error('Xəta baş verdi');
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, translations, updateTranslation }}>
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
