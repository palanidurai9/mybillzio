import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client (Bypass RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    // 1. Check for Service Key
    if (!supabaseServiceKey) {
        console.warn('⚠️ No SUPABASE_SERVICE_ROLE_KEY found. Running in SIMULATION MODE.');

        // --- SIMULATION MODE (Mock Data) ---
        const mockShops = [
            { id: 'mock-1', name: "Palani's Shop (Simulated)", owner_id: 'user-1', daily_summary_time: '21:00' },
            { id: 'mock-2', name: "Demo Store (Simulated)", owner_id: 'user-2', daily_summary_time: '21:00' }
        ];

        const results = [];
        console.log('\n--- STARTING DAILY SUMMARY JOB (SIMULATION) ---');

        for (const shop of mockShops) {
            // Simulate Data
            const totalSales = 1500;
            const cash = 1000;
            const upi = 500;
            const credit = 0;
            const totalPending = 250;

            const message = `
📅 *Daily Summary - ${new Date().toLocaleDateString('en-IN')}*
Shop: ${shop.name}

✅ *Total Sales:* ₹${totalSales}

💵 Cash: ₹${cash}
📱 UPI: ₹${upi}
📝 Credit: ₹${credit}

⚠️ *Total Pending Collection:* ₹${totalPending}

Good night! 🌙
`;
            // Mock Send
            console.log(`\n--- [MOCK WHATSAPP] Sending to Owner ${shop.owner_id} ---`);
            console.log(message);
            console.log('---------------------------------------------------\n');

            results.push({ shop: shop.name, status: 'sent (simulated)' });
        }

        return NextResponse.json({
            success: true,
            mode: 'SIMULATION',
            message: 'Service Key missing. Used mock data to demonstrate logic.',
            processed: results.length
        });
    }

    // 2. Real Mode (With Service Key)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        const { data: shops, error: shopError } = await supabase
            .from('shops')
            .select('*')
            .in('subscription_plan', ['BASIC', 'PRO'])
            .eq('daily_summary_enabled', true);

        if (shopError) {
            return NextResponse.json({ error: 'Database error', details: shopError }, { status: 500 });
        }

        if (!shops || shops.length === 0) {
            return NextResponse.json({ message: 'No eligible shops found for summary.' });
        }

        const results = [];

        for (const shop of shops) {
            const currentHour = new Date().getHours();
            const [targetHour] = (shop.daily_summary_time || '21:00').split(':');

            if (!force && parseInt(targetHour) !== currentHour) {
                continue;
            }

            // Data Aggregation
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { data: bills } = await supabase
                .from('bills')
                .select('total_amount, payment_mode')
                .eq('shop_id', shop.id)
                .gte('created_at', today.toISOString());

            let totalSales = 0;
            let cash = 0;
            let upi = 0;
            let credit = 0;

            bills?.forEach(b => {
                const amt = Number(b.total_amount);
                totalSales += amt;
                if (b.payment_mode === 'cash') cash += amt;
                else if (b.payment_mode === 'upi') upi += amt;
                else if (b.payment_mode === 'credit') credit += amt;
            });

            const { data: creditBills } = await supabase
                .from('bills')
                .select('total_amount')
                .eq('shop_id', shop.id)
                .eq('payment_mode', 'credit');

            const totalPending = creditBills?.reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;

            const message = `
📅 *Daily Summary - ${today.toLocaleDateString('en-IN')}*
Shop: ${shop.name}

✅ *Total Sales:* ₹${totalSales}

💵 Cash: ₹${cash}
📱 UPI: ₹${upi}
📝 Credit: ₹${credit}

⚠️ *Total Pending Collection:* ₹${totalPending}

Good night! 🌙
`;

            console.log(`\n--- [MOCK WHATSAPP] Sending to Owner ${shop.owner_id} ---`);
            console.log(message);
            console.log('---------------------------------------------------\n');

            results.push({ shop: shop.name, status: 'sent', data: { totalSales, totalPending } });
        }

        return NextResponse.json({ success: true, processed: results.length, details: results });

    } catch (err) {
        console.error("Cron Job Error:", err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
