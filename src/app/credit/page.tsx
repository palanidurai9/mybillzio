'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Users } from 'lucide-react';
import styles from './page.module.css';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface CreditEntry {
    customer: string; // Phone number
    totalDue: number;
    lastBillDate: string;
}

export default function CreditPage() {
    const router = useRouter();
    const [credits, setCredits] = useState<CreditEntry[]>([]);
    const [totalPending, setTotalPending] = useState(0);
    const [loading, setLoading] = useState(true);

    const [shopName, setShopName] = useState('');

    useEffect(() => {
        const fetchCreditData = async () => {
            // 1. Auth & Shop Check
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace('/login');
                return;
            }

            const { data: shop } = await supabase
                .from('shops')
                .select('id, name')
                .eq('owner_id', user.id)
                .single();

            if (!shop) {
                router.replace('/setup');
                return;
            }

            setShopName(shop.name);

            // 2. Fetch Credit Bills
            const { data: bills } = await supabase
                .from('bills')
                .select('*')
                .eq('shop_id', shop.id)
                .eq('payment_mode', 'credit');

            if (!bills) {
                setLoading(false);
                return;
            }

            // 3. Group by customer
            const customerMap: Record<string, CreditEntry> = {};

            bills.forEach((bill: any) => {
                if (bill.customer_phone) {
                    const phone = bill.customer_phone;
                    if (!customerMap[phone]) {
                        customerMap[phone] = {
                            customer: phone,
                            totalDue: 0,
                            lastBillDate: bill.created_at
                        };
                    }
                    customerMap[phone].totalDue += Number(bill.total_amount);
                    // Update last date if newer
                    if (new Date(bill.created_at) > new Date(customerMap[phone].lastBillDate)) {
                        customerMap[phone].lastBillDate = bill.created_at;
                    }
                }
            });

            const list = Object.values(customerMap).sort((a, b) => b.totalDue - a.totalDue);
            setCredits(list);
            setTotalPending(list.reduce((acc, curr) => acc + curr.totalDue, 0));
            setLoading(false);
        };

        fetchCreditData();
    }, [router]);

    if (loading) {
        return <div className={styles.container} style={{ justifyContent: 'center' }}><p>Loading...</p></div>;
    }

    const sendReminder = (customer: string, amount: number) => {
        const text = `Hello! A gentle reminder to pay the pending amount of ₹${amount} at ${shopName || 'our shop'}. Thank you!`;
        window.open(`https://wa.me/${customer}?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className={styles.title}>Pending Amount Manager</h1>
            </header>

            <motion.div
                className={styles.summaryCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <span className={styles.totalLabel}>Total Pending</span>
                    <span className={styles.totalValue}>₹{totalPending}</span>
                </div>
                <Users size={48} opacity={0.5} />
            </motion.div>

            <div className={styles.listContainer}>
                {credits.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No pending credits. Great job!</p>
                    </div>
                ) : (
                    credits.map((item, index) => (
                        <motion.div
                            key={item.customer}
                            className={styles.customerCard}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className={styles.customerInfo}>
                                {/* Formatting phone to look nice e.g. 98765 43210 */}
                                <h3>{item.customer.replace(/(\d{5})(\d{5})/, '$1 $2')}</h3>
                                <p>Last bill: {new Date(item.lastBillDate).toLocaleDateString('en-IN')}</p>
                            </div>
                            <div className={styles.actionArea}>
                                <span className={styles.dueAmount}>₹{item.totalDue}</span>
                                <button
                                    className={styles.whatsappBtn}
                                    onClick={() => sendReminder(item.customer, item.totalDue)}
                                >
                                    <MessageCircle size={14} /> Remind
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
