import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Zap, LayoutDashboard, Smartphone, Heart, ShieldCheck } from 'lucide-react';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/mybillzio-logo.png"
            alt="MyBillzio Logo"
            width={160}
            height={45}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <Link href="/login" className={styles.ctaButton}>
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>For Indian Small Businesses 🇮🇳</div>
          <h1 className={styles.heroTitle}>
            Daily business made <br />
            <span className={styles.gradientText}>Simple, Clear & Stress-free</span>
          </h1>
          <p className={styles.heroSubtitle}>
            MyBillzio is not complex accounting software. <br />
            It is a <strong>daily business control tool</strong> designed for your shop.
          </p>
          <div className={styles.heroActions}>
            <Link href="/login" className={styles.primaryCta}>
              Start billing in 10 seconds
            </Link>
            <p className={styles.noCredit}>No credit card required • Free plan available</p>
          </div>
        </div>
      </section>

      {/* Our Promises Grid */}
      <section className={styles.promisesSection}>
        <h2 className={styles.sectionTitle}>Our 6 Promises to You</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.iconBox}><Zap size={24} /></div>
            <h3>Simple-aa irukkum</h3>
            <p>No training needed. Open it for the first time, and you'll understand it instantly. Simple English.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.iconBox}><LayoutDashboard size={24} /></div>
            <h3>Built for Daily Use</h3>
            <p>Not just for weekly accounting. Designed for the daily rush of billing and checking stock.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.iconBox}><CheckCircle2 size={24} /></div>
            <h3>No Confusion</h3>
            <p>Bill, Stock, Udhaar (Credit) – see everything clearly in one place. No complex menus.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.iconBox}><Smartphone size={24} /></div>
            <h3>No App Install Needed</h3>
            <p>Works directly in your browser on Mobile and Laptop. Save space on your phone.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.iconBox}><Heart size={24} /></div>
            <h3>Affordable</h3>
            <p>Heavy costs are bad for business. We have budget-friendly pricing for small shops.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.iconBox}><ShieldCheck size={24} /></div>
            <h3>Honest Product</h3>
            <p>No ads, no distractions, no useless features. Only what helps your business grow.</p>
          </div>
        </div>
      </section>

      {/* Unique Section */}
      <section className={styles.uniqueSection}>
        <div className={styles.uniqueContainer}>
          <h2 className={styles.sectionTitle}>Why MyBillzio is Different</h2>

          <div className={styles.uniqueGrid}>
            <div className={styles.uniqueItem}>
              <h3>🔹 Not Accounting Software</h3>
              <p>We are a <strong>Daily Business Control Tool</strong>. We don't complicate things with balance sheets. We focus on Cash, Stock, and Udhaar.</p>
            </div>

            <div className={styles.uniqueItem}>
              <h3>🔹 Small Shop Mindset</h3>
              <p>Built for real small shop problems, not for big companies. We understand your daily hustle.</p>
            </div>

            <div className={styles.uniqueItem}>
              <h3>🔹 Speed is Priority</h3>
              <p><strong>10 seconds to make a bill.</strong> Because if software is slow, you can't use it when customers are waiting.</p>
            </div>

            <div className={styles.uniqueItem}>
              <h3>🔹 Owner Control</h3>
              <p>Business running well? Pending payments? Stock available? Control is always in your hands.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <h2>Ready to simplify your shop?</h2>
        <Link href="/setup" className={styles.bigCtaBtn}>
          Setup your shop in 30 seconds
        </Link>
      </section>

      <footer className={styles.footer}>
        <p>© 2024 MyBillzio. Made with ❤️ for Local Businesses.</p>
      </footer>

      {/* Structured Data for SEO */}
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
            "description": "MyBillzio makes daily business simple, clear, and stress-free for small shops. Bill, Stock, Udhaar management.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "150"
            }
          })
        }}
      />
    </main>
  );
}
