import Link from 'next/link';
import { Check, X } from 'lucide-react';
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
                    <h2 className={styles.planName}>Free (Trial)</h2>
                    <div className={styles.price}>
                        ₹0 <span className={styles.period}>/ forever</span>
                    </div>
                    <p style={{ marginBottom: '1rem', color: '#6B7280', fontSize: '0.9rem' }}>Perfect for trying out the app.</p>
                    <ul className={styles.features}>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Create 20 Bills / Month
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Pending Amount Management
                        </li>
                        <li className={`${styles.feature} ${styles.disabled}`}>
                            <X size={20} className={styles.xIcon} />
                            Stock Management
                        </li>
                        <li className={`${styles.feature} ${styles.disabled}`}>
                            <X size={20} className={styles.xIcon} />
                            WhatsApp Summary
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
                        ₹299 <span className={styles.period}>/ month</span>
                    </div>
                    <p style={{ marginBottom: '1rem', color: '#6B7280', fontSize: '0.9rem' }}>Full daily usage for most shops.</p>
                    <ul className={styles.features}>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            <strong>Unlimited Billing</strong>
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Stock Management
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            WhatsApp Share (Bills & Summary)
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            PDF & Excel Exports
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
                        ₹499 <span className={styles.period}>/ month</span>
                    </div>
                    <p style={{ marginBottom: '1rem', color: '#6B7280', fontSize: '0.9rem' }}>For power users & GST shops.</p>
                    <ul className={styles.features}>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Everything in Basic
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            GST Summaries
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Advanced Date Analytics
                        </li>
                        <li className={styles.feature}>
                            <Check size={20} className={styles.checkIcon} />
                            Priority Support
                        </li>
                    </ul>
                    <Link href="/login?plan=pro" className={styles.ctaButtonOutline}>
                        Upgrade to Pro
                    </Link>
                </div>
            </div>

            <div className={styles.rationale}>
                👉 Daily cost – peanuts compared to tea 🍵
            </div>
        </div>
    );
}
