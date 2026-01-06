'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Package, AlertTriangle, Edit2, ArrowLeft } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';
import { getPlanConfig } from '@/lib/plans';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function StockPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [stockEnabled, setStockEnabled] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace('/login');
                return;
            }

            // Check Plan
            const { data: shop } = await supabase.from('shops').select('subscription_plan').eq('owner_id', user.id).single();
            if (shop) {
                const config = getPlanConfig(shop.subscription_plan);
                setStockEnabled(config.stock_enabled);

                if (config.stock_enabled) {
                    fetchProducts(user.id);
                } else {
                    setLoading(false);
                }
            }
        };
        init();
    }, [router]);

    const fetchProducts = async (userId: string) => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('owner_id', userId)
            .order('name');
        setProducts(data || []);
        setLoading(false);
    };

    const handleSave = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: shop } = await supabase.from('shops').select('id').eq('owner_id', user.id).single();
        if (!shop) return;

        const payload = {
            name,
            price: parseFloat(price),
            stock: parseInt(stock) || 0,
            shop_id: shop.id,
            owner_id: user.id
        };

        if (editingProduct) {
            await supabase.from('products').update(payload).eq('id', editingProduct.id);
        } else {
            await supabase.from('products').insert(payload);
        }

        setShowAddModal(false);
        setEditingProduct(null);
        setName(''); setPrice(''); setStock('');
        fetchProducts(user.id);
    };

    const openEdit = (p: any) => {
        setEditingProduct(p);
        setName(p.name);
        setPrice(p.price);
        setStock(p.stock);
        setShowAddModal(true);
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    if (!stockEnabled && !loading) {
        return (
            <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <Package size={64} color="#9CA3AF" style={{ marginBottom: '1rem' }} />
                <h1 className={styles.title}>Stock Management Locked</h1>
                <p style={{ color: '#6B7280', margin: '1rem 0' }}>Upgrade to Basic plan to manage inventory.</p>
                <Button onClick={() => router.push('/pricing')}>View Plans</Button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ArrowLeft size={24} onClick={() => router.back()} style={{ cursor: 'pointer' }} />
                    <h1 className={styles.title}>Stock</h1>
                </div>
                <button className={styles.addButton} onClick={() => { setEditingProduct(null); setName(''); setPrice(''); setStock(''); setShowAddModal(true); }}>
                    <Plus size={18} /> Add
                </button>
            </header>

            <div className={styles.searchData}>
                <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {loading ? <p>Loading...</p> : (
                <div className={styles.list}>
                    {filteredProducts.map(p => (
                        <div key={p.id} className={styles.productCard} onClick={() => openEdit(p)}>
                            <div className={styles.productInfo}>
                                <h3>{p.name}</h3>
                                <div className={styles.productMeta}>₹{p.price}</div>
                            </div>
                            <div className={styles.stockControl}>
                                <div className={`${styles.stockBadge} ${p.stock < 10 ? (p.stock === 0 ? styles.outStock : styles.lowStock) : styles.inStock}`}>
                                    {p.stock} in stock
                                </div>
                                {p.stock < 10 && <AlertTriangle size={14} color="#C2410C" />}
                            </div>
                        </div>
                    ))}
                    {filteredProducts.length === 0 && <p style={{ textAlign: 'center', color: '#9CA3AF' }}>No products found.</p>}
                </div>
            )}

            {showAddModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>{editingProduct ? 'Edit Product' : 'New Product'}</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Input label="Product Name" value={name} onChange={e => setName(e.target.value)} />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Input label="Price (₹)" type="number" value={price} onChange={e => setPrice(e.target.value)} />
                                <Input label="Stock Qty" type="number" value={stock} onChange={e => setStock(e.target.value)} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <Button onClick={handleSave}>Save Product</Button>
                            <button onClick={() => setShowAddModal(false)} style={{ padding: '12px', background: 'transparent', border: 'none', color: '#6B7280' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
