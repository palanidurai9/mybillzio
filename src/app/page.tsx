import Link from 'next/link';
import Image from 'next/image';
import { Zap, ShoppingBag, Users } from 'lucide-react';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/mybillzio-logo.png"
            alt="MyBillzio Logo"
            width={180}
            height={50}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <Link href="/login" className={styles.ctaButton} style={{ padding: '0.5rem 1.25rem', fontSize: '1rem' }}>
          Get Started
        </Link>
      </header>

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          <span className={styles.textBlue}>Simple</span> <span className={styles.textGreen}>billing. </span>
          <span className={styles.textBlue}>Clear</span> <span className={styles.textGreen}>business.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          The easiest billing app for Indian small businesses. Manage sales, stock, and credit (udhaar) in seconds.
        </p>
        <Link href="/login" className={styles.ctaButton}>
          Start for Free
        </Link>
      </section>

      <section className={styles.features}>
        <h2 style={{ width: '100%', textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', color: '#1f2937' }}>
          Why Choose MyBillzio?
        </h2>
        <div className={styles.featureCard}>
          <Zap className={styles.featureIcon} size={32} />
          <h3 className={styles.featureTitle}>Fast Billing</h3>
          <p className={styles.featureText}>Create bills in less than 10 seconds. Send via WhatsApp instantly.</p>
        </div>
        <div className={styles.featureCard}>
          <ShoppingBag className={styles.featureIcon} size={32} />
          <h3 className={styles.featureTitle}>Stock Tracking</h3>
          <p className={styles.featureText}>Stock updates automatically when you sell. Get low stock alerts.</p>
        </div>
        <div className={styles.featureCard}>
          <Users className={styles.featureIcon} size={32} />
          <h3 className={styles.featureTitle}>Udhaar Manager</h3>
          <p className={styles.featureText}>Know exactly who owes you money. Send reminders easily.</p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "MyBillzio",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web, Android, iOS",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            },
            "description": "The easiest billing and udhaar management app for Indian small businesses.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "100"
            }
          })
        }}
      />
    </main >
  );
}
