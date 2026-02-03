import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BookingForm } from "@/components/BookingForm";
import { BookingSuccess } from "@/components/BookingSuccess";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: string | number;
  price: string | number;
}

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
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("slug", slug)
          .single();

        if (profileError || !profileData) {
          console.error("Profile fetch error:", profileError);
          toast.error("Profissional não encontrado");
          navigate("/404"); // Assuming there is a 404 page or similar
          return;
        }

        setProfile(profileData);

        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("profile_id", profileData.id);

        if (servicesError) {
          console.error("Services fetch error:", servicesError);
          // Don't block loading if services fail, just show empty
        } else {
            // Map DB services to component format
            const mappedServices = servicesData.map(s => ({
                id: s.id,
                name: s.title,
                description: s.description,
                duration: `${s.duration} min`,
                price: `R$ ${s.price}`,
                // icon: null // Component handles missing icon
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

  return (
    <div className="min-h-screen gradient-subtle">
       {/* Optionally show Profile Info here, e.g. Avatar and Name override Hero? 
           For now let's use the standard Hero but maybe add a personalized header */}
       
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-4 flex items-center gap-4">
             {profile.avatar_url && (
                <img src={profile.avatar_url} alt={profile.name} className="w-12 h-12 rounded-full object-cover" />
             )}
             <div>
                <h1 className="font-bold text-xl">{profile.name}</h1>
                <p className="text-sm text-muted-foreground">{profile.bio || "Profissional de serviços"}</p>
             </div>
        </div>
      </div>

      {showSuccess ? (
        <BookingSuccess onNewBooking={handleNewBooking} />
      ) : (
        <>
          <HeroSection />
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
          />
        </>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        <p>© 2025 {profile.name}. Todos os direitos reservados.</p>
        <p className="text-xs mt-2">Powered by Booking Buddy</p>
      </footer>
    </div>
  );
};

export default ProfessionalProfile;
