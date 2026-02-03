-- Migration to add subscription and trial management to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trialing',
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'pro',
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '14 days');

-- Update existing profiles to have a trial if they don't have one
UPDATE public.profiles
SET 
  subscription_status = 'trialing',
  trial_ends_at = created_at + interval '14 days'
WHERE subscription_status IS NULL;
