import Link from 'next/link';
import { Check } from 'lucide-react';
import styles from './page.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pricing - MyBillzio',
    description: 'Choose the right plan for your business. Affordable pricing for Indian small businesses.',
};

export default function PricingPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Simple, Transparent Pricing</h1>
                <p className={styles.subtitle}>
                    Choose the plan that fits your business needs. No hidden charges.
                </p>
            </div>

            <div className={styles.grid}>
                {/* Free Plan */}
                <div className={styles.card}>
                    <h2 className={styles.planName}>Free</h2>
                    <div className={styles.price}>
                        ₹0 <span className={styles.period}>/ forever</span>
                    </div>
                    <ul className={styles.features}>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Try MyBillzio
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Everyday billing
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Manage customers
                        </li>
                    </ul>
                    <Link href="/login" className={styles.ctaButtonOutline}>
                        Get Started
                    </Link>
                </div>

                {/* Basic Plan */}
                <div className={`${styles.card} ${styles.popular}`}>
                    <div className={styles.popularBadge}>POPULAR</div>
                    <h2 className={styles.planName}>Basic</h2>
                    <div className={styles.price}>
                        ₹299 <span className={styles.period}>/ year</span>
                    </div>
                    <ul className={styles.features}>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Unlimited billing
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Complete Stock Management
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Credit (Udhaar) Management
                        </li>
                    </ul>
                    <Link href="/login?plan=basic" className={styles.ctaButton}>
                        Upgrade to Basic
                    </Link>
                </div>

                {/* Pro Plan */}
                <div className={styles.card}>
                    <h2 className={styles.planName}>Pro</h2>
                    <div className={styles.price}>
                        ₹499 <span className={styles.period}>/ year</span>
                    </div>
                    <ul className={styles.features}>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Everything in Basic
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Advanced Reports
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            GST Summary
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            PDF & Excel Exports
                        </li>
                    </ul>
                    <Link href="/login?plan=pro" className={styles.ctaButtonOutline}>
                        Upgrade to Pro
                    </Link>
                </div>

                {/* Enterprise Plan */}
                <div className={styles.card}>
                    <h2 className={styles.planName}>Enterprise</h2>
                    <div className={styles.price}>
                        Custom
                    </div>
                    <ul className={styles.features}>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Dedicated Support
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Custom Features
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Multi-shop Management
                        </li>
                    </ul>
                    <Link href="mailto:support@mybillzio.com" className={styles.ctaButtonOutline}>
                        Contact Us
                    </Link>
                </div>
            </div>

            <div className={styles.rationale}>
                👉 Daily cost – peanuts compared to tea 🍵
            </div>
        </div>
    );
}
