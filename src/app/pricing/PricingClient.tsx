'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Loader2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';
import { loadRazorpay } from '@/lib/razorpay';

export default function PricingClient() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [shopId, setShopId] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data: shop } = await supabase
                    .from('shops')
                    .select('id')
                    .eq('owner_id', user.id)
                    .single();
                if (shop) setShopId(shop.id);
            }
        };
        checkAuth();
    }, []);

    const handleUpgrade = async (plan: string, price: number) => {
        if (!user) {
            router.push(`/login?redirect=/pricing`);
            return;
        }

        if (!shopId) {
            alert("Shop not found. Please setup your shop first.");
            router.push('/setup');
            return;
        }

        setLoading(true);

        try {
            // 1. Load Razorpay SDK
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert('Razorpay SDK failed to load. Check your internet.');
                return;
            }

            // 2. Create Order
            const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                body: JSON.stringify({ amount: price }),
            });
            const { orderId, amount, currency, error } = await res.json();

            if (error) {
                alert('Order creation failed: ' + error);
                return;
            }

            // 3. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure this is in .env.local
                amount: amount,
                currency: currency,
                name: 'MyBillzio',
                description: `Upgrade to ${plan} Plan`,
                order_id: orderId,
                handler: async function (response: any) {
                    // 4. Verify Payment
                    const verifyRes = await fetch('/api/payment/verify', {
                        method: 'POST',
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            shop_id: shopId,
                            plan_id: plan.toUpperCase()
                        }),
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        alert('Upgrade Successful! Welcome to ' + plan + ' Plan.');
                        router.push('/dashboard');
                    } else {
                        alert('Payment verification failed.');
                    }
                },
                prefill: {
                    email: user.email,
                },
                theme: {
                    color: '#2563EB',
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                    <button className={styles.ctaButtonOutline} disabled>
                        Current Plan
                    </button>
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
                    <button
                        onClick={() => handleUpgrade('Basic', 299)}
                        className={styles.ctaButton}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Upgrade to Basic'}
                    </button>
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
                    <button
                        onClick={() => handleUpgrade('Pro', 499)}
                        className={styles.ctaButtonOutline}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Upgrade to Pro'}
                    </button>
                </div>
            </div>

            <div className={styles.rationale}>
                👉 Daily cost – peanuts compared to tea 🍵
            </div>
        </div>
    );
}
