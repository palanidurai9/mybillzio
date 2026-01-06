import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'MyBillzio - Daily Business Control',
        short_name: 'MyBillzio',
        description: 'Simple, Clear, Stress-free Business Control for Small Shops',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#558AF2',
        icons: [
            {
                src: '/icon.png?v=2', // Using the logo we set as icon
                sizes: 'any',
                type: 'image/png',
            },
        ],
    };
}
