-- Migration to create professional_services join table
CREATE TABLE IF NOT EXISTS public.professional_services (
    professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    PRIMARY KEY (professional_id, service_id)
);

-- Enable RLS
ALTER TABLE public.professional_services ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Professional services are viewable by everyone" 
ON public.professional_services FOR SELECT 
USING (true);

-- Allow professionals/shops to manage their own links
CREATE POLICY "Shops can manage professional services" 
ON public.professional_services FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.professionals p
        WHERE p.id = professional_id
        AND p.profile_id = auth.uid()
    )
);
