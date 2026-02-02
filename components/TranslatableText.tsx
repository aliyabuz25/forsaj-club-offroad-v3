import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface TranslatableTextProps {
    text: string;
    className?: string;
    as?: React.ElementType;
}

const TranslatableText: React.FC<TranslatableTextProps> = ({
    text,
    className = '',
    as: Component = 'span'
}) => {
    const { translateText, language } = useLanguage();
    const [translatedText, setTranslatedText] = useState(text);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (language === 'AZ') {
            setTranslatedText(text);
            return;
        }

        let isMounted = true;
        const doTranslate = async () => {
            setLoading(true);
            const result = await translateText(text);
            if (isMounted) {
                setTranslatedText(result);
                setLoading(false);
            }
        };

        doTranslate();
        return () => { isMounted = false; };
    }, [text, language, translateText]);

    return (
        <Component className={`${className} ${loading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}>
            {translatedText}
        </Component>
    );
};

export default TranslatableText;
