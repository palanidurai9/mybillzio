-- Add Daily Summary preferences to shops table
ALTER TABLE public.shops 
ADD COLUMN IF NOT EXISTS daily_summary_enabled boolean default true,
ADD COLUMN IF NOT EXISTS daily_summary_time time default '21:00'; -- 9 PM Default
