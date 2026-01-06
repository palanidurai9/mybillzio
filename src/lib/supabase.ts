import { createClient } from '@supabase/supabase-js';

// Note: These env vars should be in .env.local
// For this MVP step, we will use placeholders or you can manually update them.
// If you don't have a supabase project yet, we will mock the calls for now
// to preserve the app flow until keys are added.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- HELPER FUNCTIONS FOR DB ACCESS ---

// 1. Get Current User
export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

// 2. Get User Shop
export const getShop = async () => {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', user.id)
        .single();
    return data;
};

// 3. Create Shop
export const createShop = async (name: string, category: string) => {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('shops')
        .insert({ name, category, owner_id: user.id })
        .select()
        .single();

    if (error) throw error;
    return data;
};
