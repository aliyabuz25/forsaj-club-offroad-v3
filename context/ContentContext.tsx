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

    // We no longer need to manually translate content in React as the CDN handles it.
    useEffect(() => {
        // Just sync if needed or keep empty
    }, [language, content]);

    const getContent = (key: string, defaultText: string = '') => {
        // Look for the item by 'key' or 'id'
        const item = content.find(c => c.key === key || c.id === key);
        return item ? item.value : defaultText;
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
