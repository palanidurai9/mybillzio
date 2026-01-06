import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MyBillzio – Daily Business Control for Small Shops",
    template: "%s | MyBillzio"
  },
  description: "MyBillzio makes daily business simple, clear, and stress-free for small shops. No complex accounting. Bill, Stock, and Pending Amount in one place.",
  keywords: ["daily business app", "billing software", "stock management", "small shop india", "kirana store app", "pending amount manager", "simple billing", "mobile billing app"],
  authors: [{ name: "MyBillzio Team" }],
  creator: "MyBillzio",
  publisher: "MyBillzio",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mybillzio.vercel.app",
    title: "MyBillzio – Daily Business Control for Small Shops",
    description: "MyBillzio makes daily business simple, clear, and stress-free for small shops. No complex accounting. Bill, Stock, and Pending Amount in one place.",
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
    title: "MyBillzio – Daily Business Control for Small Shops",
    description: "MyBillzio makes daily business simple, clear, and stress-free for small shops. No complex accounting. Bill, Stock, and Pending Amount in one place.",
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
