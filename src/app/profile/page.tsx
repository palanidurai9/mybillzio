
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut, Store, User, Edit2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [shopName, setShopName] = useState('Loading...');
    const [shopType, setShopType] = useState('');
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [newShopName, setNewShopName] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace('/login');
                return;
            }
            setEmail(user.email || '');

            const { data: shop } = await supabase
                .from('shops')
                .select('*')
                .eq('owner_id', user.id)
                .single();

            if (shop) {
                setShopName(shop.name);
                setShopType(shop.category);
                setNewShopName(shop.name);
            }
        };
        fetchProfile();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/login');
    };

    const handleUpdateProfile = async () => {
        if (!newShopName.trim()) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from('shops')
                .update({ name: newShopName })
                .eq('owner_id', user.id);

            if (!error) {
                setShopName(newShopName);
                setShowEditPopup(false);
            }
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className={styles.title}>My Profile</h1>
            </header>

            <motion.div
                className={styles.card}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={24} color="#6B7280" />
                    </div>
                    <div>
                        <div className={styles.label}>Account Email</div>
                        <div className={styles.value}>{email}</div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className={styles.card}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Store size={24} color="#3B82F6" />
                        </div>
                        <div>
                            <div className={styles.label}>Shop Name</div>
                            <div className={styles.value}>{shopName}</div>
                        </div>
                    </div>
                    <button onClick={() => setShowEditPopup(true)} className={styles.editBtn}>
                        <Edit2 size={18} />
                    </button>
                </div>
                {shopType && (
                    <div style={{ paddingLeft: 'calc(48px + 1rem)' }}>
                        <span style={{
                            background: '#DBEAFE',
                            color: '#1E40AF',
                            padding: '4px 12px',
                            borderRadius: '16px',
                            fontSize: '0.875rem',
                            textTransform: 'capitalize'
                        }}>
                            {shopType}
                        </span>
                    </div>
                )}
            </motion.div>

            <motion.button
                className={styles.logoutBtn}
                onClick={handleLogout}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileTap={{ scale: 0.98 }}
            >
                <LogOut size={20} /> Logout
            </motion.button>

            <AnimatePresence>
                {showEditPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.modalOverlay}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={styles.modalContent}
                        >
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Edit Shop Name</h2>
                            <Input
                                label="Shop Name"
                                value={newShopName}
                                onChange={(e) => setNewShopName(e.target.value)}
                            />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <Button onClick={handleUpdateProfile}>Save Changes</Button>
                                <button
                                    onClick={() => setShowEditPopup(false)}
                                    className={styles.cancelBtn}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
