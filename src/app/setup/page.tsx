'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './page.module.css';
import { motion } from 'framer-motion';
import { supabase, createShop } from '@/lib/supabase';

export default function SetupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [shopName, setShopName] = useState('');
    const [category, setCategory] = useState('retail');
    // First product details
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    // Protect route with Supabase
    useEffect(() => {
        const checkUser = async () => {
            const user = await supabase.auth.getUser();
            if (!user.data.user) router.replace('/login');
        };
        checkUser();
    }, [router]);

    const handleShopSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shopName) return;

        try {
            await createShop(shopName, category);
            setStep(2);
        } catch (error) {
            console.error('Error creating shop:', error);
            alert('Failed to create shop. Please try again.');
        }
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productName || !price) return;

        try {
            const user = await supabase.auth.getUser();
            // Fetch shop ID
            const { data: shop } = await supabase
                .from('shops')
                .select('id')
                .eq('owner_id', user.data.user?.id)
                .single();

            if (!shop) throw new Error("Shop not found");

            const { error } = await supabase
                .from('products')
                .insert({
                    shop_id: shop.id,
                    owner_id: user.data.user?.id,
                    name: productName,
                    price: parseFloat(price),
                    stock: parseInt(stock) || 0
                });

            if (error) throw error;

            router.push('/billing?onboarding=true');

        } catch (error) {
            console.error("Error creating product:", error);
            alert('Failed to add product.');
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.authCard}>

                {/* Step Indicator */}
                <div className={styles.stepIndicator}>
                    <div className={`${styles.stepDot} ${step >= 1 ? styles.active : ''}`} />
                    <div className={`${styles.stepDot} ${step >= 2 ? styles.active : ''}`} />
                </div>

                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h1 className={styles.title}>Setup your Shop</h1>
                        <p className={styles.subtitle}>Tell us about your business</p>
                        <form onSubmit={handleShopSubmit} className={styles.form}>
                            <Input
                                label="Shop Name"
                                placeholder="e.g. Siva Mobiles"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                required
                            />

                            <div>
                                <label className={styles.label}>Business Type</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        className={styles.select}
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="retail">Kirana / Retail (General Store)</option>
                                        <option value="mobile">Mobile / Electronics / Accessories</option>
                                        <option value="hardware">Hardware / Electricals / Paint</option>
                                        <option value="medical">Medical / Pharmacy</option>
                                        <option value="clothing">Textile / Clothing / Tailoring</option>
                                        <option value="restaurant">Restaurant / Cafe / Bakery</option>
                                        <option value="service">Service Center / Repair Shop</option>
                                        <option value="wholesaler">Wholesaler / Distributor</option>
                                        <option value="other">Other Business</option>
                                    </select>
                                </div>
                            </div>

                            <Button type="submit">Continue</Button>
                        </form>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h1 className={styles.title}>Add First Item</h1>
                        <p className={styles.subtitle}>Add one product to start billing immediately.</p>
                        <form onSubmit={handleProductSubmit} className={styles.form}>
                            <Input
                                label="Item Name"
                                placeholder="e.g. Rice 1kg or Screen Guard"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                required
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Input
                                    label="Price (₹)"
                                    type="number"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Stock (Qty)"
                                    type="number"
                                    placeholder="e.g. 50"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>
                            <Button type="submit">Start Billing</Button>
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
