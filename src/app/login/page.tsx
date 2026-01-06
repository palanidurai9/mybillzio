'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<'email' | 'check-email'>('email');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // If user is already logged in, redirect
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: shop } = await supabase
                    .from('shops')
                    .select('id')
                    .eq('owner_id', user.id)
                    .single();

                if (shop) router.push('/dashboard');
                else router.push('/setup');
            }
        };
        checkUser();
    }, [router]);

    const handleSendMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: email,
                options: {
                    emailRedirectTo: `${window.location.origin}/setup`, // Handle routing in setup
                },
            });

            if (error) throw error;

            setStep('check-email');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to send login link. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <AnimatePresence mode="wait">
                    {step === 'email' ? (
                        <motion.div
                            key="email"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <Image
                                    src="/mybillzio-logo.png"
                                    alt="MyBillzio"
                                    width={200}
                                    height={60}
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            </div>
                            <p className={styles.subtitle}>Enter your email to start</p>

                            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}
                            {message && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{message}</div>}

                            <form onSubmit={handleSendMagicLink} className={styles.form}>
                                <Input
                                    type="email"
                                    placeholder="yourname@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    label="Email Address"
                                    required
                                />
                                <Button type="submit" isLoading={isLoading} disabled={!email.includes('@')}>
                                    Send Login Link
                                </Button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="check-email"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <Image
                                    src="/mybillzio-logo.png"
                                    alt="MyBillzio"
                                    width={150}
                                    height={45}
                                    style={{ objectFit: 'contain', opacity: 0.8 }}
                                />
                            </div>
                            <h1 className={styles.title}>Check your Email</h1>
                            <p className={styles.subtitle}>We sent a login link to <strong>{email}</strong></p>

                            <div style={{ textAlign: 'center', margin: '2rem 0', color: '#666', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.9rem' }}>Click the link in the email to login instantly.</p>
                            </div>

                            <button
                                type="button"
                                className={styles.backButton}
                                onClick={() => {
                                    setStep('email');
                                    setError('');
                                    setMessage('');
                                }}
                            >
                                Use different email
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
