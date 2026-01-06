'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Plus, Minus, CheckCircle, Share2, ArrowLeft } from 'lucide-react';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';

// Types
interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
}

export default function BillingPage() {
    return (
        <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading Billing System...</div>}>
            <BillingContent />
        </Suspense>
    );
}

function BillingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isOnboarding = searchParams.get('onboarding') === 'true';

    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<Record<string, number>>({});
    const [showPayment, setShowPayment] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'credit'>('cash');
    const [customerPhone, setCustomerPhone] = useState('');
    const [user, setUser] = useState<any>(null);

    const [shop, setShop] = useState<any>(null);

    // New Product State
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductStock, setNewProductStock] = useState('');
    const [isAddingProduct, setIsAddingProduct] = useState(false);

    const handleAddNewProduct = async () => {
        if (!newProductName || !newProductPrice) return;
        setIsAddingProduct(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .insert({
                    shop_id: shop.id,
                    owner_id: user.id,
                    name: newProductName,
                    price: parseFloat(newProductPrice),
                    stock: parseInt(newProductStock) || 0
                })
                .select()
                .single();

            if (error) throw error;

            setProducts(prev => [data, ...prev]);
            setShowAddProduct(false);
            setNewProductName('');
            setNewProductPrice('');
            setNewProductStock('');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        } finally {
            setIsAddingProduct(false);
        }
    };

    // Load products from Supabase
    useEffect(() => {
        const fetchScanData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace('/login');
                return;
            }
            setUser(user);

            const { data: shop } = await supabase
                .from('shops')
                .select('*')
                .eq('owner_id', user.id)
                .single();

            if (!shop) {
                router.replace('/setup');
                return;
            }
            setShop(shop);

            const { data: products, error } = await supabase
                .from('products')
                .select('*')
                .eq('shop_id', shop.id)
                .order('created_at', { ascending: false });

            if (products) setProducts(products);
        };

        fetchScanData();
    }, [router]);

    const addToCart = (id: string) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => {
            const newQty = (prev[id] || 0) - 1;
            if (newQty <= 0) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: newQty };
        });
    };

    const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
        const product = products.find(p => p.id === id);
        return total + (product ? product.price * qty : 0);
    }, 0);

    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleGenerateBill = async () => {
        if (!shop || !user) return;

        try {
            // 1. Create the Bill
            const { data: bill, error: billError } = await supabase
                .from('bills')
                .insert({
                    shop_id: shop.id,
                    owner_id: user.id,
                    total_amount: cartTotal,
                    payment_mode: paymentMode,
                    customer_phone: customerPhone || null,
                    items: cart // storing JSON of {productId: qty}
                })
                .select()
                .single();

            if (billError) throw billError;

            // 2. Update Stock (Parallel Requests)
            await Promise.all(Object.entries(cart).map(async ([productId, qty]) => {
                const product = products.find(p => p.id === productId);
                if (product) {
                    await supabase
                        .from('products')
                        .update({ stock: product.stock - qty })
                        .eq('id', productId);
                }
            }));

            // 3. Refresh Products List
            const { data: updatedProducts } = await supabase
                .from('products')
                .select('*')
                .eq('shop_id', shop.id)
                .order('created_at', { ascending: false });

            if (updatedProducts) setProducts(updatedProducts);

            setShowPayment(false);
            setShowSuccess(true);
        } catch (error) {
            console.error('Billing Error:', error);
            alert('Failed to generate bill');
        }
    };

    const shareOnWhatsapp = () => {
        const text = `Bill from MyBillzio: Total ₹${cartTotal}. Thanks for visiting!`;
        window.open(`https://wa.me/${customerPhone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    const finish = () => {
        if (isOnboarding) {
            router.push('/dashboard');
        } else {
            setCart({});
            setShowSuccess(false);
            setCustomerPhone('');
        }
    };

    if (showSuccess) {
        return (
            <div className={styles.successContainer}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={styles.successCard}
                >
                    <div style={{ color: '#22C55E', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                        <CheckCircle size={64} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Bill Generated!</h1>
                    <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Total: ₹{cartTotal}</p>

                    <button onClick={shareOnWhatsapp} className={styles.whatsappBtn}>
                        <Share2 size={20} /> Share on WhatsApp
                    </button>

                    <button onClick={finish} className={styles.primaryBtn}>
                        {isOnboarding ? 'Go to Dashboard' : 'New Bill'}
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <ArrowLeft size={24} color="#374151" />
                    </button>
                    <h1 style={{ fontSize: '1.125rem', fontWeight: 700 }}>New Bill</h1>
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

            <div style={{ padding: '1rem', position: 'sticky', top: 60, background: '#F3F4F6', zIndex: 30, display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={20} style={{ position: 'absolute', left: 12, top: 12, color: '#9CA3AF' }} />
                    <input
                        autoFocus
                        type="search"
                        inputMode="search"
                        enterKeyHint="search"
                        placeholder="Search products..."
                        className={styles.searchBar}
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowAddProduct(true)}
                    style={{
                        background: '#3B82F6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.75rem',
                        width: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={24} />
                </button>
            </div>

            <div className={styles.productList}>
                {filteredProducts.length === 0 ? (
                    <div className={styles.emptyState}>No products found.</div>
                ) : (
                    filteredProducts.map(product => {
                        const qty = cart[product.id] || 0;
                        return (
                            <div key={product.id} className={styles.productCard}>
                                <div className="productInfo">
                                    <h3 style={{ fontWeight: 600, color: '#111827' }}>{product.name}</h3>
                                    <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>₹{product.price} • Stock: {product.stock}</p>
                                </div>
                                {qty === 0 ? (
                                    <button onClick={() => addToCart(product.id)} className={styles.addButton}>
                                        <Plus size={18} /> Add
                                    </button>
                                ) : (
                                    <div className={styles.qtyControls}>
                                        <button onClick={() => removeFromCart(product.id)} className={clsx(styles.qtyBtn, styles.qtyBtnMinus)}><Minus size={14} /></button>
                                        <span className={styles.qtyCount}>{qty}</span>
                                        <button onClick={() => addToCart(product.id)} className={clsx(styles.qtyBtn, styles.qtyBtnPlus)}><Plus size={14} /></button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <AnimatePresence>
                {cartCount > 0 && (
                    <motion.div
                        className={styles.footer}
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                    >
                        <div className={styles.billSummary}>
                            <span className={styles.totalLabel}>{cartCount} Items</span>
                            <span className={styles.totalAmount}>₹{cartTotal}</span>
                        </div>
                        <button className={styles.checkoutBtn} onClick={() => setShowPayment(true)}>
                            Proceed to Pay
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showPayment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.modalOverlay}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className={styles.modalContent}
                        >
                            <h2 className={styles.modalTitle}>Payment Mode</h2>

                            <div style={{ marginBottom: '1.5rem' }}>
                                {['cash', 'upi', 'credit'].map((mode) => (
                                    <div
                                        key={mode}
                                        onClick={() => setPaymentMode(mode as any)}
                                        className={clsx(
                                            styles.paymentOption,
                                            paymentMode === mode && styles.paymentOptionSelected
                                        )}
                                    >
                                        <span className={styles.label}>
                                            {mode === 'credit' ? 'Pending Amount (Credit)' : mode}
                                        </span>
                                        {paymentMode === mode && <CheckCircle size={20} color="#3B82F6" />}
                                    </div>
                                ))}
                            </div>

                            {paymentMode === 'credit' && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <Input
                                        label="Customer Mobile (Required)"
                                        type="tel"
                                        placeholder="Customer Number"
                                        value={customerPhone}
                                        onChange={e => setCustomerPhone(e.target.value)}
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleGenerateBill}
                                disabled={paymentMode === 'credit' && customerPhone.length < 10}
                                className={styles.primaryBtn}
                                style={{ opacity: (paymentMode === 'credit' && customerPhone.length < 10) ? 0.5 : 1 }}
                            >
                                Confirm & Generate Bill
                            </button>
                            <button
                                onClick={() => setShowPayment(false)}
                                className={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAddProduct && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.modalOverlay}
                        style={{ zIndex: 100 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={styles.modalContent}
                            style={{ margin: 'auto', maxWidth: '350px', background: 'white', borderRadius: '1rem', padding: '1.5rem', position: 'relative' }}
                        >
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Add New Item</h2>

                            <form onSubmit={(e) => { e.preventDefault(); handleAddNewProduct(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <Input
                                    label="Item Name"
                                    placeholder="e.g. Milk 500ml or Haircut"
                                    value={newProductName}
                                    onChange={(e) => setNewProductName(e.target.value)}
                                    required
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <Input
                                        label="Price (₹)"
                                        type="number"
                                        placeholder="0.00"
                                        value={newProductPrice}
                                        onChange={(e) => setNewProductPrice(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label={shop?.category === 'service' ? "Stock (Optional)" : "Stock (Qty)"}
                                        type="number"
                                        placeholder={shop?.category === 'service' ? "∞" : "0"}
                                        value={newProductStock}
                                        onChange={(e) => setNewProductStock(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!newProductName || !newProductPrice || isAddingProduct}
                                    className={styles.primaryBtn}
                                    style={{ marginTop: '0.5rem' }}
                                >
                                    {isAddingProduct ? 'Adding...' : 'Add to Inventory'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddProduct(false)}
                                    className={styles.cancelBtn}
                                >
                                    Cancel
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
