-- Run this command in your Supabase SQL Editor to update the existing 'shops' table
-- This adds the missing columns for the new Pricing Plan features without deleting your data.

ALTER TABLE public.shops 
ADD COLUMN IF NOT EXISTS subscription_plan text default 'FREE',
ADD COLUMN IF NOT EXISTS subscription_status text default 'active',
ADD COLUMN IF NOT EXISTS subscription_expiry timestamp with time zone;

-- Optional: Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'shops';
