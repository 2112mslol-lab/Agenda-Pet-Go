-- Migration to add payment settings to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS payment_settings JSONB DEFAULT '{
    "accept_pix": true,
    "pix_key": "",
    "accept_card": true,
    "payment_at_venue": true,
    "auto_confirm_on_payment": false
}'::jsonb;

-- Add payment method to appointments
ALTER TABLE public.agendamentos
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'presencial';
