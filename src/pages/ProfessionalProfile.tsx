import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BookingForm } from "@/components/BookingForm";
import { BookingSuccess } from "@/components/BookingSuccess";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  logo_url: string | null;
  hero_bg_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  scheduling_rules?: any;
  notification_settings?: any;
  payment_settings?: {
    accept_pix: boolean;
    pix_key: string;
    accept_card: boolean;
    payment_at_venue: boolean;
  };
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: string | number;
  price: string | number;
  icon_name?: string;
}

const hexToHsl = (hex: string): string => {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse r, g, b
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

import { TrustSection } from "@/components/TrustSection";

const ProfessionalProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("slug", slug)
          .single();

        if (profileError || !profileData) {
          toast.error("Profissional não encontrado");
          navigate("/");
          return;
        }

        const typedProfile: Profile = {
          id: (profileData as any).id,
          name: (profileData as any).name,
          slug: (profileData as any).slug,
          bio: (profileData as any).bio,
          avatar_url: (profileData as any).avatar_url,
          logo_url: (profileData as any).logo_url,
          hero_bg_url: (profileData as any).hero_bg_url,
          primary_color: (profileData as any).primary_color,
          secondary_color: (profileData as any).secondary_color,
          payment_settings: (profileData as any).payment_settings,
          scheduling_rules: (profileData as any).scheduling_rules,
        };

        setProfile(typedProfile);
        document.title = `${typedProfile.name} | Agendamento Online`;

        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("profile_id", profileData.id);

        if (!servicesError && servicesData) {
            const mappedServices = servicesData.map((s: any) => ({
                id: s.id,
                name: s.title,
                description: s.description,
                duration: `${s.duration} min`,
                price: s.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                icon_name: s.icon_name
            }));
            setServices(mappedServices);
        }

      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [slug, navigate]);

  useEffect(() => {
    if (profile) {
      document.title = `${profile.name} | Agendamento Online`;
    }
  }, [profile]);

  const handleBookingSuccess = () => {
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewBooking = () => {
    setShowSuccess(false);
    setSelectedService("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Carregando Agenda...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const primaryHex = profile.primary_color || "#10b981";
  const primaryHsl = hexToHsl(primaryHex);

  return (
    <div className="min-h-screen font-outfit" style={{ backgroundColor: `hsla(${primaryHsl}, 0.02)` }}>
       <style>{`
         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
         :root {
           --primary: ${primaryHsl};
           --ring: ${primaryHsl};
           --background-accent: hsla(${primaryHsl}, 0.05);
         }
         .text-primary { color: hsl(${primaryHsl}) !important; }
         .bg-primary { background-color: hsl(${primaryHsl}) !important; }
         .border-primary { border-color: hsl(${primaryHsl}) !important; }
         .bg-primary\\/10 { background-color: hsla(${primaryHsl}, 0.1); }
         .bg-primary\\/20 { background-color: hsla(${primaryHsl}, 0.2); }
         .text-primary-foreground { color: #fff; }
       `}</style>

      <header className="bg-white/80 backdrop-blur-xl border-b sticky top-0 z-50 transition-all border-slate-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {profile.logo_url ? (
                  <img src={profile.logo_url} alt={profile.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm" />
              ) : (
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {profile.name.charAt(0)}
                  </div>
              )}
              <div className="hidden sm:block">
                <h1 className="font-black text-slate-900 leading-tight">{profile.name}</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Aberto para Agendamento</p>
              </div>
            </div>
            <a href="#services">
                <Button className="rounded-full px-6 font-black uppercase text-xs tracking-widest h-12 shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                   Quero Agendar
                </Button>
            </a>
        </div>
      </header>

      {showSuccess ? (
        <BookingSuccess onNewBooking={handleNewBooking} />
      ) : (
        <main className="animate-in fade-in duration-1000">
          <HeroSection 
            shopName={profile.name} 
            backgroundUrl={profile.hero_bg_url} 
          />
          
          <TrustSection />

          <ServicesSection
            services={services}
            selectedService={selectedService}
            onSelectService={setSelectedService}
          />

          <BookingForm
            profileId={profile.id}
            services={services}
            selectedService={selectedService}
            onSuccess={handleBookingSuccess}
            schedulingRules={profile.scheduling_rules}
            paymentSettings={profile.payment_settings}
          />
        </main>
      )}

      <footer className="py-20 bg-slate-900 text-white border-t border-slate-800">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12 max-w-6xl mx-auto">
                <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                         {profile.logo_url && <img src={profile.logo_url} className="w-12 h-12 rounded-2xl opacity-80" alt="" />}
                         <p className="font-black text-2xl tracking-tighter">{profile.name}</p>
                    </div>
                    <p className="text-slate-400 max-w-sm font-medium">Excelência em estética animal. Seu pet em boas mãos, com agendamento fácil e rápido.</p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Desenvolvido por</p>
                    <div className="flex items-center gap-2 bg-white/5 px-6 py-4 rounded-[2rem] border border-white/5">
                        <span className="font-black text-xl tracking-tighter">AgendaPet<span className="text-primary italic text-2xl">Go</span></span>
                    </div>
                </div>
            </div>
            
            <div className="mt-20 pt-8 border-t border-white/5 text-center">
                <p className="text-slate-500 text-sm font-medium">© 2025 {profile.name}. Todos os direitos reservados.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfessionalProfile;
