import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

const SEO: React.FC<SEOProps> = ({
    title = 'Forsaj Club - Offroad & Motorsport Azerbaijan',
    description = 'Azerbaijan\'s premier offroad and motorsport club. Join us for thrilling races, extreme offroad adventures, and a community of adrenaline enthusiasts.',
    keywords = 'offroad, motorsport, azerbaijan, baku, racing, 4x4, forsaj club, extreme sports',
    image = 'https://forsaj.az/assets/og-image.jpg',
    url = 'https://forsaj.az'
}) => {
    const siteTitle = `${title} | Forsaj Club`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={siteTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
