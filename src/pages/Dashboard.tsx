import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Loader2,
  Phone,
  RefreshCw,
  LogOut,
  ExternalLink,
  User,
  X,
  Settings,
  Users,
  Scissors,
  PawPrint
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfessionalManager } from "@/components/ProfessionalManager";
import { BusinessHoursManager } from "@/components/BusinessHoursManager";
import { ServiceManager } from "@/components/ServiceManager";

type AppointmentStatus = "pendente" | "confirmado" | "recusado";

interface Appointment {
  id: string;
  nome_cliente: string;
  email: string;
  whatsapp: string;
  servico: string;
  data_hora: string;
  status: AppointmentStatus;
  created_at: string;
  pet_name: string | null;
  pet_species: string | null;
}

const statusConfig = {
  pendente: {
    label: "Pendente",
    variant: "outline" as const,
    className: "border-warning text-warning",
  },
  confirmado: {
    label: "Confirmado",
    variant: "default" as const,
    className: "bg-success text-success-foreground",
  },
  recusado: {
    label: "Recusado",
    variant: "destructive" as const,
    className: "",
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      setUserId(session.user.id);

      const { data: profileBody, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (error || !profileBody) {
         toast.warning("Complete seu perfil para receber agendamentos!");
      } else {
         setProfile(profileBody);
      }

      fetchAppointments(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const addToGoogleCalendar = (appointment: Appointment) => {
    const startTime = new Date(appointment.data_hora);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); 
    
    const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.append("action", "TEMPLATE");
    url.searchParams.append("text", `Agendamento: ${appointment.servico} - ${appointment.nome_cliente}`);
    url.searchParams.append("dates", `${formatDate(startTime)}/${formatDate(endTime)}`);
    url.searchParams.append("details", `Cliente: ${appointment.nome_cliente}\nWhatsapp: ${appointment.whatsapp}\nPet: ${appointment.pet_name || 'N/A'}`);
    
    window.open(url.toString(), "_blank");
  };

  const fetchAppointments = async (currentUserId: string = userId!) => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("agendamentos")
        .select("*")
        .eq("profile_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAppointments((data as Appointment[]) || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("agendamentos")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
      );

      toast.success(
        status === "confirmado"
          ? "Agendamento confirmado!"
          : "Agendamento recusado"
      );
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Erro ao atualizar agendamento");
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = appointments.filter((a) => a.status === "pendente").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Painel Pet Shop
                </h1>
                <p className="text-sm text-muted-foreground">
                    {profile ? `Olá, ${profile.name}` : "Gerencie seu estabelecimento"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
               {profile && (
                   <Button variant="ghost" className="gap-2" onClick={() => window.open(`/${profile.slug}`, '_blank')}>
                       <ExternalLink className="w-4 h-4" />
                       <span className="hidden sm:inline">Ver Perfil</span>
                   </Button>
               )}
              <Button
                variant="destructive"
                size="icon"
                onClick={handleLogout}
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="agendamentos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[800px]">
            <TabsTrigger value="agendamentos" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden lg:inline">Agendamentos</span>
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 h-5 min-w-[20px] justify-center">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profissionais" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden lg:inline">Profissionais</span>
            </TabsTrigger>
            <TabsTrigger value="servicos" className="gap-2">
              <Scissors className="w-4 h-4" />
              <span className="hidden lg:inline">Serviços</span>
            </TabsTrigger>
            <TabsTrigger value="horarios" className="gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden lg:inline">Horários</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden lg:inline">Gestão</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agendamentos">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum agendamento encontrado
                </h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                   Os agendamentos dos seus clientes aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map((appointment, index) => {
                  const config = statusConfig[appointment.status];
                  const isUpdating = updatingId === appointment.id;
                  const isPending = appointment.status === "pendente";

                  return (
                    <div
                      key={appointment.id}
                      className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-card"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                                <Scissors className="w-4 h-4 text-primary" />
                                {appointment.servico}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {format(
                                  new Date(appointment.data_hora),
                                  "EEEE, dd 'de' MMMM 'às' HH:mm",
                                  { locale: ptBR }
                                )}
                              </p>
                            </div>
                            <Badge
                              variant={config.variant}
                              className={cn("shrink-0", config.className)}
                            >
                              {config.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-2">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground font-medium uppercase">Dono / Cliente</p>
                              <div className="flex items-center gap-2 text-foreground">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span>{appointment.nome_cliente}</span>
                              </div>
                              <div className="flex items-center gap-2 text-foreground">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <a
                                  href={`https://wa.me/55${appointment.whatsapp}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-primary transition-colors"
                                >
                                  {appointment.whatsapp}
                                </a>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground font-medium uppercase">Pet</p>
                              <div className="flex items-center gap-2 text-foreground font-semibold">
                                <PawPrint className="w-4 h-4 text-primary" />
                                <span>{appointment.pet_name || "Não informado"}</span>
                                {appointment.pet_species && (
                                  <Badge variant="outline" className="text-[10px] h-4 uppercase">
                                    {appointment.pet_species}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {isPending && (
                          <div className="flex gap-2 md:flex-col lg:flex-row">
                            <Button
                              onClick={() => updateStatus(appointment.id, "confirmado")}
                              disabled={isUpdating}
                              className="flex-1 md:flex-none gap-2"
                            >
                              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                              Confirmar
                            </Button>
                            <Button
                              onClick={() => updateStatus(appointment.id, "recusado")}
                              disabled={isUpdating}
                              variant="outline"
                              className="flex-1 md:flex-none gap-2 border-destructive text-destructive"
                            >
                              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                              Recusar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profissionais">
            {profile && <ProfessionalManager profileId={profile.id} />}
          </TabsContent>

          <TabsContent value="servicos">
            {profile && <ServiceManager profileId={profile.id} />}
          </TabsContent>

          <TabsContent value="horarios">
            {profile && <BusinessHoursManager profileId={profile.id} />}
          </TabsContent>

          <TabsContent value="config">
             <div className="p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center">
                 <Settings className="w-12 h-12 text-muted-foreground/30 mb-4" />
                 <h3 className="font-semibold text-lg">Configurações Gerais</h3>
                 <p className="text-muted-foreground max-w-md mx-auto">
                     Em breve: Gestão de categorias de serviços, edições do perfil visível e planos.
                 </p>
             </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
export default Dashboard;
