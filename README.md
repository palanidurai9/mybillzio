# MyBillzio - Simple Billing for Small Business

MyBillzio is a fast, mobile-first billing application designed for Indian micro-businesses.
It features OTP login, Stock Management, Udhaar Tracking, and WhatsApp Bill Sharing.

## Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Modules (Glassmorphism design)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Font**: Outfit (Google Fonts)

## Getting Started

1.  install dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features (MVP)
- **Login**: Mobile number based (Simulated).
- **Setup**: Shop profile and first product.
- **Billing**: Fast billing interface, stock auto-deduction, 'Udhaar' support.
- **Dashboard**: Daily sales summary, low stock alerts.

## Project Structure
- `src/app`: Page routes (`login`, `setup`, `billing`, `dashboard`).
- `src/components/ui`: Reusable UI components.
- `src/styles`: Global styles and tokens.
- `src/lib`: Type definitions and utilities.

## Data Storage
Currently uses `localStorage` for MVP demonstration. Ready to connect to Supabase/Postgres backend.
