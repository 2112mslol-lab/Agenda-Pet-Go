-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Establish Row Level Security (RLS) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create services table (each professional has their own services)
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow public read access to services
CREATE POLICY "Services are viewable by everyone" 
ON public.services FOR SELECT 
USING (true);

-- Allow professionals to manage their own services
CREATE POLICY "Professionals can insert own services" 
ON public.services FOR INSERT 
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Professionals can update own services" 
ON public.services FOR UPDATE 
USING (auth.uid() = profile_id);

CREATE POLICY "Professionals can delete own services" 
ON public.services FOR DELETE 
USING (auth.uid() = profile_id);

-- Update agendamentos (appointments) to link to profile and service
ALTER TABLE public.agendamentos 
ADD COLUMN profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
ADD COLUMN service_id UUID REFERENCES public.services(id) ON DELETE SET NULL;

-- Only update policies if table exists (it does), but we need to update RLS
DROP POLICY IF EXISTS "Enable read access for all users" ON public.agendamentos;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.agendamentos;

-- New policies for agendamentos
-- Anyone can create an appointment (public booking)
CREATE POLICY "Anyone can create appointments" 
ON public.agendamentos FOR INSERT 
WITH CHECK (true);

-- Professionals can view appointments assigned to them
CREATE POLICY "Professionals can view their own appointments" 
ON public.agendamentos FOR SELECT 
USING (auth.uid() = profile_id);

-- Professionals can update their own appointments (confirm/reject)
CREATE POLICY "Professionals can update their own appointments" 
ON public.agendamentos FOR UPDATE 
USING (auth.uid() = profile_id);
