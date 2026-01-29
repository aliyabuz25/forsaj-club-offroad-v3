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
        fetch('/api/translations').then(res => res.json()).then(setTranslations);
    }, []);

    const t = (key: string): string => {
        if (!translations[key]) return key;
        return translations[key][language] || translations[key]['AZ'] || key;
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
