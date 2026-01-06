import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MyBillzio - #1 Simple Billing App for Indian Small Business",
    template: "%s | MyBillzio"
  },
  description: "The easiest free billing, invoice, and Udhaar app for Indian shopkeepers. Create bills, track stock, and manage customer credit on mobile.",
  keywords: ["billing app", "invoice maker", "stock management", "udhaar khata", "dukandaar app", "gst billing", "small business india", "inventory app"],
  authors: [{ name: "MyBillzio Team" }],
  creator: "MyBillzio",
  publisher: "MyBillzio",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mybillzio.vercel.app",
    title: "MyBillzio - Free Mobile Billing App for Retail & Service",
    description: "Create professional bills, manage inventory, and track credit (Udhaar) easily. Perfect for Kirana, Mobile Shops, and Service Centers.",
    siteName: "MyBillzio",
    images: [{
      url: "/mybillzio-logo.png",
      width: 1200,
      height: 630,
      alt: "MyBillzio App",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyBillzio - #1 Billing App for India",
    description: "Stop using paper. Switch to MyBillzio for fast billing and stock tracking.",
    images: ["/mybillzio-logo.png"],
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  metadataBase: new URL('https://mybillzio.vercel.app'),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#558AF2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen w-full relative">
          {children}
        </main>
      </body>
    </html>
  );
}
