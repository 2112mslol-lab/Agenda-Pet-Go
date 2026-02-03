-- Migration to add settings and customization for Pet Shop SaaS

-- 1. Add settings columns to profiles
ALTER TABLE public.profiles
ADD COLUMN logo_url TEXT,
ADD COLUMN hero_bg_url TEXT,
ADD COLUMN primary_color TEXT DEFAULT '#10b981', -- Emerald-500
ADD COLUMN secondary_color TEXT DEFAULT '#f59e0b', -- Amber-500
ADD COLUMN scheduling_rules JSONB DEFAULT '{
    "min_advance_hours": 2,
    "max_days_advance": 30,
    "slot_interval_minutes": 30
}'::jsonb,
ADD COLUMN notification_settings JSONB DEFAULT '{
    "new_appointment_alert": true,
    "client_reminder_4h": true,
    "client_reminder_day_before": true
}'::jsonb;

-- 2. Add icon selection to services
ALTER TABLE public.services
ADD COLUMN icon_name TEXT DEFAULT 'Scissors';

-- 3. Add notification tracking to appointments
ALTER TABLE public.agendamentos
ADD COLUMN reminder_sent BOOLEAN DEFAULT false,
ADD COLUMN last_notification_at TIMESTAMP WITH TIME ZONE;
