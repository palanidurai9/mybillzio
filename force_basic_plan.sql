-- Force all shops to BASIC plan to verify features
UPDATE public.shops
SET subscription_plan = 'BASIC';
