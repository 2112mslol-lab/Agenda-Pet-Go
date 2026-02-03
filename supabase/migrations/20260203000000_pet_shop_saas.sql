-- Migration to enhance the booking system into a Pet Shop Micro-SaaS

-- 1. Create professionals table
CREATE TABLE public.professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    specialty TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals are viewable by everyone" 
ON public.professionals FOR SELECT 
USING (true);

CREATE POLICY "Shops can manage their own professionals" 
ON public.professionals FOR ALL 
USING (auth.uid() = profile_id);

-- 2. Create pets table (linked to a shop and potentially a client)
CREATE TABLE public.pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    species TEXT NOT NULL, -- 'dog', 'cat', etc.
    breed TEXT,
    size TEXT, -- 'p', 'm', 'g'
    owner_name TEXT NOT NULL,
    owner_whatsapp TEXT NOT NULL,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shops can view their pets" 
ON public.pets FOR SELECT 
USING (auth.uid() = profile_id);

CREATE POLICY "Shops can manage their pets" 
ON public.pets FOR ALL 
USING (auth.uid() = profile_id);

-- 3. Update agendamentos table
ALTER TABLE public.agendamentos 
ADD COLUMN professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
ADD COLUMN pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
ADD COLUMN pet_name TEXT, -- Fallback/Direct entry
ADD COLUMN pet_species TEXT;

-- 4. Create opening hours table
CREATE TABLE public.business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0 (Sunday) to 6 (Saturday)
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT false,
    UNIQUE(profile_id, day_of_week)
);

ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business hours are viewable by everyone" 
ON public.business_hours FOR SELECT 
USING (true);

CREATE POLICY "Shops can manage their business hours" 
ON public.business_hours FOR ALL 
USING (auth.uid() = profile_id);

-- 5. Function to check for scheduling conflicts (Prevention of duplicates)
CREATE OR REPLACE FUNCTION check_appointment_conflict()
RETURNS TRIGGER AS $$
DECLARE
    appointment_duration INTEGER;
    conflict_exists BOOLEAN;
BEGIN
    -- Get duration from the related service
    SELECT duration INTO appointment_duration FROM public.services WHERE id = NEW.service_id;
    IF appointment_duration IS NULL THEN
        appointment_duration := 60; -- Default 60 mins if no service linked
    END IF;

    -- Check if professional has any overlapping appointment
    SELECT EXISTS (
        SELECT 1 FROM public.agendamentos
        WHERE professional_id = NEW.professional_id
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
        AND status IN ('pendente', 'confirmado')
        AND (
            (data_hora >= NEW.data_hora AND data_hora < (NEW.data_hora + (appointment_duration || ' minutes')::interval))
            OR
            ((data_hora + (appointment_duration || ' minutes')::interval) > NEW.data_hora AND (data_hora + (appointment_duration || ' minutes')::interval) <= (NEW.data_hora + (appointment_duration || ' minutes')::interval))
        )
    ) INTO conflict_exists;

    IF conflict_exists THEN
        RAISE EXCEPTION 'Este profissional já possui um agendamento para este horário.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to prevent double booking
CREATE TRIGGER prevent_double_booking
BEFORE INSERT OR UPDATE ON public.agendamentos
FOR EACH ROW
EXECUTE FUNCTION check_appointment_conflict();
