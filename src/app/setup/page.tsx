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
    const [shopId, setShopId] = useState<string | null>(null);
    const [shopName, setShopName] = useState('');
    const [category, setCategory] = useState('retail');
    // First product details
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    const [isChecking, setIsChecking] = useState(true);

    // Protect route & Restore state
    useEffect(() => {
        const checkState = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.replace('/login');
                    return;
                }

                // Check if shop exists
                const { data: shop } = await supabase
                    .from('shops')
                    .select('id, name, category')
                    .eq('owner_id', user.id)
                    .single();

                if (shop) {
                    setShopId(shop.id);
                    setShopName(shop.name);
                    if (shop.category) setCategory(shop.category);

                    // Check if setup is already complete (has products)
                    const { count } = await supabase
                        .from('products')
                        .select('*', { count: 'exact', head: true })
                        .eq('shop_id', shop.id);

                    if (count && count > 0) {
                        router.replace('/dashboard');
                        return;
                    } else {
                        // Shop exists, but no products -> Resume at Step 2
                        setStep(2);
                    }
                }
            } catch (error) {
                console.error("Error checking state", error);
            } finally {
                setIsChecking(false);
            }
        };
        checkState();
    }, [router]);

    if (isChecking) {
        return (
            <div className={styles.container}>
                <div style={{
                    width: '30px',
                    height: '30px',
                    border: '3px solid #e5e7eb',
                    borderTopColor: '#3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <style jsx>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    const handleShopSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shopName) return;

        try {
            const newShop = await createShop(shopName, category);
            if (newShop) {
                setShopId(newShop.id);
                setStep(2);
            }
        } catch (error) {
            console.error('Error creating shop:', error);
            alert('Failed to create shop. Please try again.');
        }
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productName || !price) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            let targetShopId = shopId;

            // Fallback: If for some reason state is lost, fetch again
            if (!targetShopId) {
                const { data: shop, error: shopError } = await supabase
                    .from('shops')
                    .select('id')
                    .eq('owner_id', user.id)
                    .single();

                if (shopError || !shop) {
                    throw new Error("Shop not found. Please try refreshing the page.");
                }
                targetShopId = shop.id;
            }

            const finalPrice = parseFloat(price);
            if (isNaN(finalPrice)) throw new Error("Invalid price entered");

            const finalStock = stock ? parseInt(stock) : 0;

            const { error } = await supabase
                .from('products')
                .insert({
                    shop_id: targetShopId,
                    owner_id: user.id,
                    name: productName,
                    price: finalPrice,
                    stock: finalStock
                });

            if (error) throw error;

            router.push('/billing?onboarding=true');

        } catch (error: any) {
            console.error("Error creating product:", error);
            alert(`Failed to add product: ${error.message || "Unknown error"}`);
        }
    };


    return (
        <div className={styles.container}>
            <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
                Step {step} of 3 {step === 2 ? '– Add Product' : ''}
            </p>

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
                        <h1 className={styles.title}>Set up your shop in 30 seconds</h1>
                        <p className={styles.subtitle}>We’ll personalise MyBillzio for your business</p>
                        <form onSubmit={handleShopSubmit} className={styles.form}>
                            <div>
                                <Input
                                    label="Shop Name"
                                    placeholder="e.g. Siva Mobiles"
                                    value={shopName}
                                    onChange={(e) => setShopName(e.target.value)}
                                    required
                                />
                                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                    This name will appear on bills sent to customers
                                </p>
                            </div>

                            <div>
                                <label className={styles.label}>What kind of shop is this?</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        className={styles.select}
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="retail">Kirana / Retail (General Store)</option>
                                        <option value="mobile">Mobile / Electronics Shop</option>
                                        <option value="hardware">Hardware / Electrical / Paint</option>
                                        <option value="clothing">Textile / Clothing / Tailoring</option>
                                        <option value="restaurant">Restaurant / Cafe / Bakery</option>
                                        <option value="medical">Medical / Pharmacy</option>
                                        <option value="service">Service / Repair Shop</option>
                                        <option value="wholesaler">Wholesaler / Distributor</option>
                                        <option value="other">Other Business</option>
                                    </select>
                                </div>
                            </div>

                            <Button type="submit">Continue → Add First Product</Button>
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
