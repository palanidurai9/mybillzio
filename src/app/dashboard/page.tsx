'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, TrendingUp, AlertTriangle, Users, Clock, Crown } from 'lucide-react';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const [shopName, setShopName] = useState('My Billzio Shop');
    const [shopCategory, setShopCategory] = useState('retail');
    const [todaySales, setTodaySales] = useState(0);
    const [todayBreakdown, setTodayBreakdown] = useState({ cash: 0, upi: 0, credit: 0 });
    const [pendingCredit, setPendingCredit] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [topDebtor, setTopDebtor] = useState<{ phone: string, amount: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEvening, setIsEvening] = useState(false);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        // Time logic
        const hour = new Date().getHours();
        setIsEvening(hour >= 18);

        if (hour < 12) setGreeting('Good Morning ☀️');
        else if (hour < 17) setGreeting('Good Afternoon 🌤️');
        else setGreeting('Good Evening 🌙');

        const fetchDashboardData = async () => {
            try {
                // 1. Check Auth & Get Shop
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.replace('/login');
                    return;
                }

                const { data: shop } = await supabase
                    .from('shops')
                    .select('*')
                    .eq('owner_id', user.id)
                    .single();

                if (!shop) {
                    router.replace('/setup');
                    return;
                }

                setShopName(shop.name);
                setShopCategory(shop.category || 'retail');

                // 2. Fetch Today's Sales with Breakdown (Resets Daily)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayISO = today.toISOString();

                const { data: todaysBills } = await supabase
                    .from('bills')
                    .select('total_amount, payment_mode')
                    .eq('shop_id', shop.id)
                    .gte('created_at', todayISO);

                let sales = 0;
                let cash = 0;
                let upi = 0;
                let creditToday = 0;

                todaysBills?.forEach(bill => {
                    const amount = Number(bill.total_amount);
                    sales += amount;
                    if (bill.payment_mode === 'cash') cash += amount;
                    else if (bill.payment_mode === 'upi') upi += amount;
                    else if (bill.payment_mode === 'credit') creditToday += amount;
                });

                setTodaySales(sales);
                setTodayBreakdown({ cash, upi, credit: creditToday });

                // 3. Fetch Total Pending Credit & Top Debtor
                const { data: creditBills } = await supabase
                    .from('bills')
                    .select('total_amount, customer_phone')
                    .eq('shop_id', shop.id)
                    .eq('payment_mode', 'credit');

                const creditTotal = creditBills?.reduce((sum, bill) => sum + Number(bill.total_amount), 0) || 0;
                setPendingCredit(creditTotal);

                // Find top debtor
                if (creditBills && creditBills.length > 0) {
                    const debtMap: Record<string, number> = {};
                    creditBills.forEach(bill => {
                        const phone = bill.customer_phone;
                        if (phone) {
                            debtMap[phone] = (debtMap[phone] || 0) + Number(bill.total_amount);
                        }
                    });

                    let maxDebt = 0;
                    let maxDebtor = '';
                    Object.entries(debtMap).forEach(([phone, amount]) => {
                        if (amount > maxDebt) {
                            maxDebt = amount;
                            maxDebtor = phone;
                        }
                    });

                    if (maxDebtor) {
                        setTopDebtor({ phone: maxDebtor, amount: maxDebt });
                    }
                }

                // 4. Fetch Low Stock Count
                const { count } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true })
                    .eq('shop_id', shop.id)
                    .lt('stock', 10);

                setLowStockCount(count || 0);

            } catch (error) {
                console.error("Error fetching dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [router]);

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                <p>Loading your shop...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>{greeting}</p>
                    <h1 className={styles.shopName}>{shopName}</h1>
                    <p className={styles.date}>
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => router.push('/pricing')}
                        style={{
                            padding: '0.5rem',
                            background: '#FEF3C7',
                            color: '#D97706',
                            border: 'none',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        <Crown size={16} /> Upgrade
                    </button>
                    <div
                        onClick={() => router.push('/profile')}
                        style={{
                            width: 40,
                            height: 40,
                            background: '#E5E7EB',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#374151">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                </div>
            </header>

            {/* Daily Summary - Conditional Display */}
            <AnimatePresence>
                {/* Scenario 1: Fresh Start (No Sales Yet) */}
                {todaySales === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={styles.dailySummary}
                        style={{
                            background: '#F0F9FF',
                            border: '1px solid #BAE6FD',
                            color: '#0284C7',
                            padding: '1rem',
                            borderRadius: '16px',
                            marginBottom: '1.5rem',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ background: 'white', padding: '8px', borderRadius: '50%' }}>
                                <Clock size={20} color="#0284C7" />
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>Fresh Start</h3>
                                <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Dashboard has been reset for today.</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Scenario 2: Evening Summary */}
                {isEvening && todaySales > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={styles.dailySummary}
                        style={{
                            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                            color: 'white',
                            padding: '1.25rem',
                            borderRadius: '16px',
                            marginBottom: '1.5rem',
                            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Clock size={20} color="white" />
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Today's Sales Breakdown</h2>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>₹{todaySales}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.9rem', opacity: 0.9 }}>
                            <span>Cash: <b>₹{todayBreakdown.cash}</b></span>
                            <span>|</span>
                            <span>UPI: <b>₹{todayBreakdown.upi}</b></span>
                            <span>|</span>
                            <span>Credit: <b>₹{todayBreakdown.credit}</b></span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nudges Section */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {isEvening && todaySales === 0 && (
                    <div style={{ padding: '12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={18} />
                        <span>Inniku bill podala? (Billing not started today?)</span>
                    </div>
                )}

                {lowStockCount > 0 && (
                    <div style={{ padding: '12px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '8px', color: '#C2410C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={18} />
                        <span>{lowStockCount} products low stock! Check Inventory.</span>
                    </div>
                )}

                {topDebtor && (
                    <div style={{ padding: '12px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => router.push('/credit')}>
                        <Users size={18} />
                        <span>{topDebtor.phone.replace(/(\d{5})(\d{5})/, '$1 $2')} – ₹{topDebtor.amount} due 🙏</span>
                    </div>
                )}
            </div>

            <div className={styles.statsGrid}>
                <motion.div
                    className={styles.statCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#2563EB' }}>
                        <TrendingUp size={20} />
                        <span className={styles.statLabel} style={{ marginBottom: 0, color: '#2563EB' }}>
                            {shopCategory === 'service' ? "Today's Revenue" : "Today's Sales"}
                        </span>
                    </div>
                    <span className={styles.statValue}>₹{todaySales}</span>
                </motion.div>

                <motion.div
                    className={styles.statCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => router.push('/credit')}
                    whileHover={{ scale: 1.02 }}
                    style={{ cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#F97316' }}>
                        <Users size={20} />
                        <span className={styles.statLabel} style={{ marginBottom: 0, color: '#F97316' }}>Pending Amount</span>
                    </div>
                    <span className={styles.statValue}>₹{pendingCredit}</span>
                </motion.div>

                {shopCategory !== 'service' && (
                    <motion.div
                        className={styles.statCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#EF4444' }}>
                            <AlertTriangle size={20} />
                            <span className={styles.statLabel} style={{ marginBottom: 0, color: '#EF4444' }}>Low Stock</span>
                        </div>
                        <span className={`${styles.statValue} ${styles.lowStock}`}>{lowStockCount} Items</span>
                    </motion.div>
                )}
            </div>

            <motion.button
                className={styles.createBillBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/billing')}
            >
                <Plus size={24} /> Create New Bill
            </motion.button>
        </div>
    );
}
