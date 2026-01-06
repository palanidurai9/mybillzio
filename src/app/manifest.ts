import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'MyBillzio',
        short_name: 'MyBillzio',
        description: 'Simple Billing & Udhaar App for Indian Business',
        start_url: '/',
        display: 'standalone',
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
