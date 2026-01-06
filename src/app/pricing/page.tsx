import type { Metadata } from 'next';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
    title: 'Pricing - MyBillzio',
    description: 'Choose the right plan for your business. Affordable pricing for Indian small businesses.',
};

export default function PricingPage() {
    return <PricingClient />;
}
