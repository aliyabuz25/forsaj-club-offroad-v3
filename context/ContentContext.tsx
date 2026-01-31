import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

interface ContentItem {
    id: string;
    section: string;
    key: string;
    value: string;
    image?: string;
}

interface ContentContextType {
    content: ContentItem[];
    getContent: (key: string, defaultText?: string) => string;
    getImage: (key: string, defaultImage?: string) => string;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [content, setContent] = useState<ContentItem[]>([]);
    const [translatedContent, setTranslatedContent] = useState<{ [key: string]: string }>({});
    const { language } = useLanguage();

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setContent(data);
            })
            .catch(err => console.error('Failed to load content', err));
    }, []);

    // Effect to translate content when language changes
    useEffect(() => {
        if (language === 'AZ') return;

        content.forEach(item => {
            const cacheKey = `${item.key}_${language}`;
            if (translatedContent[cacheKey]) return;

            // Simple debounce/queue could be better but for now direct fetch
            fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: item.value, targetLang: language.toLowerCase() })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.translatedText) {
                        setTranslatedContent(prev => ({ ...prev, [cacheKey]: data.translatedText }));
                    }
                })
                .catch(() => { });
        });
    }, [language, content]);

    const getContent = (key: string, defaultText: string = '') => {
        const item = content.find(c => c.key === key);
        const text = item ? item.value : defaultText;

        if (language === 'AZ') return text;

        // Return translated version if available, otherwise return original (while it loads)
        return translatedContent[`${key}_${language}`] || text;
    };

    const getImage = (key: string, defaultImage: string = '') => {
        const item = content.find(c => c.key === key);
        return item && item.image ? item.image : defaultImage;
    };

    return (
        <ContentContext.Provider value={{ content, getContent, getImage }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};
