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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) return null;

  const primaryHex = profile.primary_color || "#10b981";
  const primaryHsl = hexToHsl(primaryHex);

  return (
    <div className="min-h-screen gradient-subtle">
       <style>{`
         :root {
           --primary: ${primaryHsl};
           --ring: ${primaryHsl};
         }
         .text-primary { color: hsl(${primaryHsl}); }
         .bg-primary { background-color: hsl(${primaryHsl}); }
         .border-primary { border-color: hsl(${primaryHsl}); }
         .bg-primary\\/10 { background-color: hsla(${primaryHsl}, 0.1); }
         .bg-primary\\/20 { background-color: hsla(${primaryHsl}, 0.2); }
         .text-primary-foreground { color: #fff; }
       `}</style>

      <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {profile.logo_url ? (
                  <img src={profile.logo_url} alt={profile.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary" />
              ) : (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {profile.name.charAt(0)}
                  </div>
              )}
              <h1 className="font-bold text-lg hidden sm:block">{profile.name}</h1>
            </div>
            <a href="#services">
                <Button variant="outline" size="sm">Nossos Serviços</Button>
            </a>
        </div>
      </header>

      {showSuccess ? (
        <BookingSuccess onNewBooking={handleNewBooking} />
      ) : (
        <>
          <HeroSection 
            shopName={profile.name} 
            backgroundUrl={profile.hero_bg_url} 
          />
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
            schedulingRules={(profile as any).scheduling_rules}
            paymentSettings={profile.payment_settings}
          />
        </>
      )}

      <footer className="py-12 bg-card text-center text-sm text-muted-foreground border-t border-border mt-12">
        <div className="container mx-auto px-4">
            <p className="font-bold text-foreground mb-4">{profile.name}</p>
            <p>© 2025 Todos os direitos reservados.</p>
            <p className="text-xs mt-4">Plataforma desenvolvida por <span className="font-bold text-primary">PetAgendaGo</span></p>
        </div>
      </footer>
    </div>
  );
};

export default ProfessionalProfile;
