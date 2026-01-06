import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/billing/', '/credit/'], // Private user data, no need to index
        },
        sitemap: 'https://mybillzio.vercel.app/sitemap.xml',
    };
}
