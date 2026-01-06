import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://mybillzio.vercel.app';

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/setup`,
            lastModified: new Date(),
            changeFrequency: 'never',
            priority: 0.5,
        },
        // Authenticated routes generally shouldn't be indexed, but having them in sitemap doesn't hurt if robots allow. 
        // Usually we want the landing page to rank highest.
    ];
}
