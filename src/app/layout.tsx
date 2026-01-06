import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MyBillzio – Simple Billing & Daily Business Control App",
    template: "%s | MyBillzio"
  },
  description: "Easy billing, stock tracking & customer credit management for Indian small businesses. No app install. Works on mobile & laptop.",
  keywords: ["billing app", "invoice maker", "stock management", "udhaar khata", "dukandaar app", "gst billing", "small business india", "inventory app"],
  authors: [{ name: "MyBillzio Team" }],
  creator: "MyBillzio",
  publisher: "MyBillzio",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mybillzio.vercel.app",
    title: "MyBillzio – Simple Billing & Daily Business Control App",
    description: "Easy billing, stock tracking & customer credit management for Indian small businesses. No app install. Works on mobile & laptop.",
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
    title: "MyBillzio – Simple Billing & Daily Business Control App",
    description: "Easy billing, stock tracking & customer credit management for Indian small businesses. No app install. Works on mobile & laptop.",
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
