'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import styles from './page.module.css';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
    const router = useRouter();
    const [shopName, setShopName] = useState('My Billzio Shop');
    const [shopCategory, setShopCategory] = useState('retail');
    const [todaySales, setTodaySales] = useState(0);
    const [pendingCredit, setPendingCredit] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

                // 2. Fetch Today's Sales
                // Set start of today (UTC) - This is a simple approximation. For strict timezones, use date-fns.
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayISO = today.toISOString();

                const { data: todaysBills } = await supabase
                    .from('bills')
                    .select('total_amount')
                    .eq('shop_id', shop.id)
                    .gte('created_at', todayISO);

                const sales = todaysBills?.reduce((sum, bill) => sum + Number(bill.total_amount), 0) || 0;
                setTodaySales(sales);

                // 3. Fetch Total Pending Credit
                const { data: creditBills } = await supabase
                    .from('bills')
                    .select('total_amount')
                    .eq('shop_id', shop.id)
                    .eq('payment_mode', 'credit');

                const credit = creditBills?.reduce((sum, bill) => sum + Number(bill.total_amount), 0) || 0;
                setPendingCredit(credit);

                // 4. Fetch Low Stock Count
                const { count } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true }) // head: true only returns count
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
                    <h1 className={styles.shopName}>{shopName}</h1>
                    <p className={styles.date}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
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
            </header>

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
                        <span className={styles.statLabel} style={{ marginBottom: 0, color: '#F97316' }}>Pending Credit</span>
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
