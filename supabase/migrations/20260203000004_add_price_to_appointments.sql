-- Migration to add price column to appointments for financial control
ALTER TABLE public.agendamentos
ADD COLUMN IF NOT EXISTS valor DECIMAL(10,2) DEFAULT 0;

-- Update existing agendamentos with prices from services if possible
UPDATE public.agendamentos a
SET valor = s.price
FROM public.services s
WHERE a.service_id = s.id AND a.valor = 0;
