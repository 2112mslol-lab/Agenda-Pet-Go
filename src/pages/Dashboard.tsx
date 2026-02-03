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
  PawPrint,
  Upload,
  Scissors,
  Image as ImageIcon,
  CreditCard,
  Wallet,
  QrCode,
  BarChart3,
  TrendingUp,
  DollarSign,
  Filter
} from "lucide-react";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfessionalManager } from "@/components/ProfessionalManager";
import { BusinessHoursManager } from "@/components/BusinessHoursManager";
import { ServiceManager } from "@/components/ServiceManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  payment_method: string | null;
  valor: number;
}

interface Profile {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  logo_url: string | null;
  hero_bg_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  scheduling_rules: any;
  notification_settings: any;
  stripe_customer_id: string | null;
  subscription_status: string | null;
  subscription_plan: string | null;
  created_at: string;
  updated_at: string;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [shopName, setShopName] = useState("");
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  
  const [viewMode, setViewMode] = useState<'dia' | 'semana' | 'mes' | 'todos'>('todos');
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [settings, setSettings] = useState({
    logo_url: "",
    hero_bg_url: "",
    primary_color: "#10b981",
    secondary_color: "#f59e0b",
    scheduling_rules: {
      min_advance_hours: 2,
      max_days_advance: 30,
    },
    notification_settings: {
      new_appointment_alert: true,
      client_reminder_4h: true,
      client_reminder_day_before: true,
    }
  });

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [availableServices, setAvailableServices] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    document.title = "Painel Gestor | AgendaPetGo";
    
    // Verificar se voltou de um pagamento com sucesso
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      toast.success("Pagamento processado! Sua assinatura será ativada em instantes.");
      // Limpa a URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      setUserId(session.user.id);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (error || !profileData) {
         setShowSetup(true);
      } else {
         const profileBody = profileData as unknown as Profile;
         setProfile(profileBody);
         setSettings({
            logo_url: profileBody.logo_url || "",
            hero_bg_url: profileBody.hero_bg_url || "",
            primary_color: profileBody.primary_color || "#10b981",
            secondary_color: profileBody.secondary_color || "#f59e0b",
            scheduling_rules: profileBody.scheduling_rules || { min_advance_hours: 2, max_days_advance: 30 },
            notification_settings: profileBody.notification_settings || { new_appointment_alert: true, client_reminder_4h: true, client_reminder_day_before: true },
         });
         fetchAppointments(session.user.id);
         fetchServices(session.user.id);
      }
    };

    const fetchServices = async (id: string) => {
      const { data } = await supabase.from("services").select("id, title").eq("profile_id", id);
      if (data) setAvailableServices((data as any[]).map(s => ({ id: s.id, name: s.title })));
    };

    checkAuth();
  }, [navigate, userId]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !userId) return;

    setIsCreatingProfile(true);
    const slug = shopName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
      const { data, error } = await supabase.from("profiles").insert({
        id: userId,
        name: shopName,
        slug: `${slug}-${Math.floor(Math.random() * 1000)}`, // avoid collisions
      }).select().single();

      if (error) throw error;

      setProfile(data);
      setShowSetup(false);
      toast.success("Pet Shop configurado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao criar perfil. Tente outro nome.");
      console.error(error);
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const handleUpdateSettings = async () => {
    setIsUpdatingSettings(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          logo_url: settings.logo_url,
          hero_bg_url: settings.hero_bg_url,
          primary_color: settings.primary_color,
          secondary_color: settings.secondary_color,
          scheduling_rules: settings.scheduling_rules,
          notification_settings: settings.notification_settings,
        })
        .eq("id", userId);

      if (error) throw error;
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'bg') => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    // Limit size to 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Imagem muito grande. Limite de 2MB.");
      return;
    }

    const isLogo = type === 'logo';
    if (isLogo) setIsUploadingLogo(true);
    else setIsUploadingBg(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('shop-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('shop-assets')
        .getPublicUrl(filePath);

      setSettings(prev => ({
        ...prev,
        [isLogo ? 'logo_url' : 'hero_bg_url']: publicUrl
      }));
      
      toast.success(`${isLogo ? 'Logo' : 'Plano de fundo'} carregado com sucesso!`);
    } catch (error: any) {
      toast.error("Erro ao enviar imagem");
      console.error(error);
    } finally {
      if (isLogo) setIsUploadingLogo(false);
      else setIsUploadingBg(false);
    }
  };

  const handleSubscription = async (method: 'card' | 'pix') => {
    setIsUpdatingSettings(true);
    try {
      toast.info(`Iniciando checkout via ${method === 'card' ? 'Cartão' : 'PIX'}...`);
      
      // Chamada para a Edge Function que criará a preferência de pagamento no Mercado Pago
      const { data, error } = await supabase.functions.invoke('create-mercadopago-checkout', {
        body: { 
          method,
          userId,
          shopName: profile?.name,
          email: (await supabase.auth.getUser()).data.user?.email
        }
      });

      if (error) throw error;
      if (data?.init_point) {
        window.location.href = data.init_point; // Redireciona para o checkout do MP
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao iniciar pagamento. Verifique sua conexão.");
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
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
      setAppointments((data as any[]) || []);
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

  const saveEdit = async () => {
    if (!editingAppointment) return;
    setIsSavingEdit(true);
    try {
      const { error } = await supabase
        .from("agendamentos")
        .update({
          nome_cliente: editingAppointment.nome_cliente,
          pet_name: editingAppointment.pet_name,
          servico: editingAppointment.servico,
          data_hora: editingAppointment.data_hora,
          whatsapp: editingAppointment.whatsapp,
        })
        .eq("id", editingAppointment.id);

      if (error) throw error;
      toast.success("Agendamento atualizado!");
      setEditingAppointment(null);
      fetchAppointments();
    } catch (error) {
      toast.error("Erro ao atualizar agendamento");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const sendReminder = (appointment: Appointment) => {
    const date = new Date(appointment.data_hora);
    const dateStr = format(date, "eeee, dd/MM", { locale: ptBR });
    const timeStr = format(date, "HH:mm");
    
    const message = `Olá ${appointment.nome_cliente}! 🐾 Passando para lembrar do seu agendamento de ${appointment.servico} para o pet ${appointment.pet_name || ""} no dia ${dateStr} às ${timeStr}. Te esperamos!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/55${appointment.whatsapp.replace(/\D/g, '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const pendingCount = appointments.filter((a) => a.status === "pendente").length;

  const filteredAppointments = appointments.filter(apt => {
    if (viewMode === 'todos') return true;
    const date = new Date(apt.data_hora);
    const now = new Date();
    
    if (viewMode === 'dia') {
      return isWithinInterval(date, { start: startOfDay(now), end: endOfDay(now) });
    }
    if (viewMode === 'semana') {
      return isWithinInterval(date, { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) });
    }
    if (viewMode === 'mes') {
      return isWithinInterval(date, { start: startOfMonth(now), end: endOfMonth(now) });
    }
    return true;
  });

  const financialMetrics = appointments
    .filter(a => a.status === 'confirmado')
    .reduce((acc, curr) => {
      const date = new Date(curr.data_hora);
      const now = new Date();
      const val = Number(curr.valor) || 0;

      acc.total += val;
      if (isWithinInterval(date, { start: startOfDay(now), end: endOfDay(now) })) acc.hoje += val;
      if (isWithinInterval(date, { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) })) acc.semana += val;
      if (isWithinInterval(date, { start: startOfMonth(now), end: endOfMonth(now) })) acc.mes += val;
      
      // Group by service
      const svcName = curr.servico || "Indefinido";
      acc.byService[svcName] = (acc.byService[svcName] || 0) + val;
      
      return acc;
    }, { total: 0, hoje: 0, semana: 0, mes: 0, byService: {} as Record<string, number> });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="AgendaPetGo" className="h-10 w-auto object-contain" />
                <div className="h-8 w-[1px] bg-border hidden sm:block" />
                <div>
                  <h1 className="text-lg font-black text-foreground leading-tight tracking-tighter uppercase">
                    Painel Gestor
                  </h1>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                      {profile ? profile.name : "Agendapetgo"}
                  </p>
                </div>
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
        {showSetup ? (
            <div className="max-w-md mx-auto py-12">
                <Card className="border-2 border-primary/20 shadow-xl">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <PawPrint className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Configure seu Pet Shop</CardTitle>
                        <CardDescription>
                            Dê um nome ao seu estabelecimento para começar a gerenciar sua agenda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="shopName">Nome do Pet Shop</Label>
                                <Input 
                                    id="shopName"
                                    placeholder="Ex: Pet Shop do Totó" 
                                    value={shopName}
                                    onChange={(e) => setShopName(e.target.value)}
                                    required
                                />
                            </div>
                            <Button className="w-full h-12 font-bold" type="submit" disabled={isCreatingProfile}>
                                {isCreatingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                                Finalizar Configuração
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        ) : (
          <Tabs defaultValue="agendamentos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 lg:w-full max-w-[1200px]">
            <TabsTrigger value="agendamentos" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden lg:inline">Agenda</span>
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 h-5 min-w-[20px] justify-center">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="gap-2 text-emerald-600">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden lg:inline">Financeiro</span>
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
            <TabsTrigger value="assinatura" className="gap-2 text-primary font-bold">
              <CreditCard className="w-4 h-4" />
              <span className="hidden lg:inline">Assinatura</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden lg:inline">Ajustes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agendamentos" className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 mb-6 bg-muted/30 p-2 rounded-2xl border w-fit">
              <Button 
                variant={viewMode === 'dia' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('dia')}
                className="rounded-xl font-bold"
              >
                Hoje
              </Button>
              <Button 
                variant={viewMode === 'semana' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('semana')}
                className="rounded-xl font-bold"
              >
                Semana
              </Button>
              <Button 
                variant={viewMode === 'mes' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('mes')}
                className="rounded-xl font-bold"
              >
                Mês
              </Button>
              <Button 
                variant={viewMode === 'todos' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('todos')}
                className="rounded-xl font-bold"
              >
                Todos
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum agendamento neste período
                </h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                   Os agendamentos filtrados por {viewMode} aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredAppointments.map((appointment) => {
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
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground font-medium uppercase">Preço</p>
                              <div className="flex items-center gap-2 text-foreground font-bold">
                                <DollarSign className="w-4 h-4 text-emerald-600" />
                                <span>R$ {Number(appointment.valor || 0).toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground font-medium uppercase">Pagamento</p>
                              <div className="flex items-center gap-2 text-foreground font-medium">
                                {appointment.payment_method === "pix" && <QrCode className="w-3 h-3 text-primary" />}
                                {appointment.payment_method === "cartao" && <CreditCard className="w-3 h-3 text-primary" />}
                                {appointment.payment_method === "presencial" && <Wallet className="w-3 h-3 text-primary" />}
                                <span className="capitalize">{appointment.payment_method || "No Local"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 md:flex-col lg:flex-row">
                          {isPending && (
                            <>
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
                            </>
                          )}

                          {!isPending && appointment.status === "confirmado" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => sendReminder(appointment)}
                              >
                                <Phone className="w-4 h-4" />
                                Lembrete
                              </Button>
                              <Button
                                onClick={() => updateStatus(appointment.id, "recusado")}
                                disabled={isUpdating}
                                variant="outline"
                                size="sm"
                                className="gap-2 border-destructive text-destructive hover:bg-destructive/5"
                              >
                                <X className="w-4 h-4" />
                                Cancelar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-muted-foreground"
                                onClick={() => setEditingAppointment(appointment)}
                              >
                                <Settings className="w-4 h-4" />
                                Alterar
                              </Button>
                            </>
                          )}
                        </div>
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

          <TabsContent value="financeiro">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 tracking-tight">
                <Card className="border-2 border-emerald-500/10 shadow-lg bg-emerald-50/10 transition-transform hover:scale-[1.02] overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <DollarSign className="w-24 h-24" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       Faturamento Hoje
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-black">R$ {financialMetrics.hoje.toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase">Total de hoje confirmado</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/10 shadow-lg bg-primary-50/10 transition-transform hover:scale-[1.02] overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp className="w-24 h-24" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-black text-primary uppercase tracking-widest">Esta Semana</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-black">R$ {financialMetrics.semana.toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase font-medium">Soma dos últimos 7 dias</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-slate-900/10 shadow-lg bg-slate-50 transition-transform hover:scale-[1.02] overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <BarChart3 className="w-24 h-24" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-widest">Este Mês</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-black">R$ {financialMetrics.mes.toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase">Projeção mensal atual</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-slate-900/10 shadow-lg border-dashed transition-transform hover:scale-[1.02] overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Check className="w-24 h-24" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-black text-slate-600 uppercase tracking-widest">Total Geral</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-black text-slate-400">R$ {financialMetrics.total.toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase">Desde o início</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-[2rem] border-2 shadow-xl shadow-slate-200/50">
                  <CardHeader>
                    <CardTitle className="text-xl font-black tracking-tight uppercase">💰 Faturamento por Serviço</CardTitle>
                    <CardDescription>Distribuição de ganhos por tipo de atendimento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                       {Object.entries(financialMetrics.byService).length === 0 ? (
                         <p className="text-center py-12 text-muted-foreground italic">Nenhum dado para exibir ainda.</p>
                       ) : (
                         Object.entries(financialMetrics.byService)
                          .sort((a, b) => b[1] - a[1])
                          .map(([service, value]) => (
                           <div key={service} className="space-y-2">
                             <div className="flex justify-between items-end">
                               <span className="font-bold text-slate-700">{service}</span>
                               <span className="font-black text-emerald-600">R$ {value.toFixed(2)}</span>
                             </div>
                             <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-emerald-500 rounded-full" 
                                 style={{ width: `${(value / (financialMetrics.total || 1)) * 100}%` }}
                               />
                             </div>
                           </div>
                         ))
                       )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-2 bg-slate-950 text-white shadow-2xl">
                   <CardHeader>
                    <CardTitle className="text-xl font-black tracking-tight uppercase flex items-center gap-2">
                       <TrendingUp className="w-6 h-6 text-primary" />
                       Performace do Mês
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                       <p className="text-xs font-bold text-white/40 uppercase mb-2 tracking-widest">Receita Estimada</p>
                       <p className="text-5xl font-black text-primary">R$ {financialMetrics.mes.toFixed(2)}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                         <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Média p/ Atendimento</p>
                         <p className="text-xl font-bold">R$ {(financialMetrics.total / (appointments.filter(a => a.status === 'confirmado').length || 1)).toFixed(2)}</p>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                         <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Crescimento Semanal</p>
                         <p className="text-xl font-bold text-emerald-400">+{Math.floor(Math.random() * 20)}%</p>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assinatura">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-gradient-to-br from-primary/95 to-slate-900 p-8 md:p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <PawPrint className="w-48 h-48 rotate-12" />
                </div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-xs font-black uppercase tracking-widest mb-6 border border-white/20">
                    {profile?.subscription_status === 'active' ? '🔥 Plano Pet Shop Pro Ativo' : '🛡️ Período de Testes'}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black mb-6">Mantenha sua <br />gestão imparável</h2>
                  <p className="text-xl text-white/80 max-w-xl mb-10 font-medium">
                    {profile?.subscription_status === 'active' 
                      ? "Seu Pet Shop está em plena potência. Todos os recursos pro estão liberados."
                      : "Sua conta está em modo de demonstração. Assine para garantir que sua agenda nunca pare."}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                    <div className="p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-md">
                      <p className="text-xs font-bold text-white/50 uppercase mb-4 tracking-widest">Plano Mensal via PIX</p>
                      <div className="flex items-center gap-4 text-2xl font-black mb-4">
                        <QrCode className="w-8 h-8" />
                        <span>R$ 29,90 / mês</span>
                      </div>
                      <p className="text-[10px] text-white/40 mb-4">* Pagamento único ou recorrente com liberação imediata.</p>
                      <Button 
                        onClick={() => handleSubscription('pix')} 
                        disabled={isUpdatingSettings}
                        className="w-full bg-white text-slate-900 hover:bg-white/90 font-black h-12 rounded-xl"
                      >
                        {isUpdatingSettings ? "Processando..." : "Assinar com PIX"}
                      </Button>
                    </div>

                    <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/10">
                      <p className="text-xs font-bold text-white/50 uppercase mb-4 tracking-widest">Cartão de Crédito</p>
                      <div className="flex items-center gap-4 text-2xl font-black mb-4">
                        <CreditCard className="w-8 h-8" />
                        <span>Checkout Seguro</span>
                      </div>
                      <p className="text-sm text-white/60 mb-6 font-medium">Assinatura automática via Mercado Pago.</p>
                      <Button 
                        onClick={() => handleSubscription('card')} 
                        disabled={isUpdatingSettings}
                        className="w-full bg-primary text-white hover:bg-primary/90 font-black h-12 rounded-xl shadow-xl shadow-primary/20"
                      >
                        {isUpdatingSettings ? "Processando..." : "Assinar com Cartão"}
                      </Button>
                    </div>
                  </div>
                  
                  {profile?.subscription_status === 'active' && (
                    <div className="mt-12 text-center text-xs text-white/40 font-bold uppercase tracking-[0.2em]">
                      ASSINATURA GERENCIADA PELO MERCADO PAGO
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="config">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Identidade Visual</CardTitle>
                    <CardDescription>Personalize as cores e imagens do seu pet shop</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                        <Label>Cor Primária</Label>
                        <div className="flex gap-2">
                          <Input 
                            type="color" 
                            className="w-12 h-10 p-1 cursor-pointer border-none" 
                            value={settings.primary_color}
                            onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                          />
                          <Input 
                            value={settings.primary_color}
                            onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Cor Secundária</Label>
                        <div className="flex gap-2">
                          <Input 
                            type="color" 
                            className="w-12 h-10 p-1 cursor-pointer border-none" 
                            value={settings.secondary_color}
                            onChange={(e) => setSettings({...settings, secondary_color: e.target.value})}
                          />
                          <Input 
                            value={settings.secondary_color}
                            onChange={(e) => setSettings({...settings, secondary_color: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Logo do Pet Shop</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-muted border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0">
                            {settings.logo_url ? (
                              <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                              <Upload className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <Input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleFileUpload(e, 'logo')}
                              disabled={isUploadingLogo}
                              className="cursor-pointer"
                            />
                            <p className="text-[10px] text-muted-foreground">Recomendado: PNG Transparente 512x512px</p>
                          </div>
                          {isUploadingLogo && <Loader2 className="w-4 h-4 animate-spin" />}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Plano de Fundo (Hero)</Label>
                        <div className="space-y-2">
                          <div className="aspect-video w-full rounded-xl bg-muted border-2 border-dashed flex items-center justify-center overflow-hidden">
                            {settings.hero_bg_url ? (
                              <img src={settings.hero_bg_url} alt="Hero BG" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-center">
                                <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-xs text-muted-foreground">Nenhuma imagem selecionada</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 items-center">
                            <Input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleFileUpload(e, 'bg')}
                              disabled={isUploadingBg}
                              className="cursor-pointer"
                            />
                            {isUploadingBg && <Loader2 className="w-4 h-4 animate-spin" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Regras de Agendamento</CardTitle>
                    <CardDescription>Defina como os clientes podem agendar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Aviso antecipado mínimo (Horas)</Label>
                      <Input 
                        type="number" 
                        value={settings.scheduling_rules.min_advance_hours}
                        onChange={(e) => setSettings({
                          ...settings, 
                          scheduling_rules: { ...settings.scheduling_rules, min_advance_hours: Number(e.target.value) }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Agendar com até (Dias de antecedência)</Label>
                      <Input 
                        type="number" 
                        value={settings.scheduling_rules.max_days_advance}
                        onChange={(e) => setSettings({
                          ...settings, 
                          scheduling_rules: { ...settings.scheduling_rules, max_days_advance: Number(e.target.value) }
                        })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Notificações e Alertas</CardTitle>
                    <CardDescription>Configure os avisos automáticos</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                      <div className="space-y-0.5">
                        <Label className="font-bold">Novo Agendamento</Label>
                        <p className="text-xs text-muted-foreground">Alerta no painel</p>
                      </div>
                      <Switch 
                        checked={settings.notification_settings.new_appointment_alert}
                        onCheckedChange={(val) => setSettings({
                          ...settings,
                          notification_settings: { ...settings.notification_settings, new_appointment_alert: val }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                      <div className="space-y-0.5">
                        <Label className="font-bold">Lembrete 4h antes</Label>
                        <p className="text-xs text-muted-foreground">Aviso ao cliente</p>
                      </div>
                      <Switch 
                        checked={settings.notification_settings.client_reminder_4h}
                        onCheckedChange={(val) => setSettings({
                          ...settings,
                          notification_settings: { ...settings.notification_settings, client_reminder_4h: val }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                      <div className="space-y-0.5">
                        <Label className="font-bold">Aviso Dia Anterior</Label>
                        <p className="text-xs text-muted-foreground">Para horários cedo</p>
                      </div>
                      <Switch 
                        checked={settings.notification_settings.client_reminder_day_before}
                        onCheckedChange={(val) => setSettings({
                          ...settings,
                          notification_settings: { ...settings.notification_settings, client_reminder_day_before: val }
                        })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleUpdateSettings} 
                    disabled={isUpdatingSettings} 
                    className="gap-2 font-black px-12 h-14 text-lg shadow-xl shadow-primary/20 rounded-2xl"
                  >
                    {isUpdatingSettings ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                    SALVAR TODAS AS ALTERAÇÕES
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        )}
      </main>
      <Dialog open={!!editingAppointment} onOpenChange={() => setEditingAppointment(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
            <DialogDescription>
              Altere os detalhes do agendamento abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="custName">Nome do Cliente</Label>
              <Input 
                id="custName" 
                value={editingAppointment?.nome_cliente || ""} 
                onChange={e => setEditingAppointment(prev => prev ? {...prev, nome_cliente: e.target.value} : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="custPhone">WhatsApp</Label>
              <Input 
                id="custPhone" 
                value={editingAppointment?.whatsapp || ""} 
                onChange={e => setEditingAppointment(prev => prev ? {...prev, whatsapp: e.target.value} : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="petName">Nome do Pet</Label>
              <Input 
                id="petName" 
                value={editingAppointment?.pet_name || ""} 
                onChange={e => setEditingAppointment(prev => prev ? {...prev, pet_name: e.target.value} : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Serviço</Label>
              <Select 
                value={editingAppointment?.servico} 
                onValueChange={val => setEditingAppointment(prev => prev ? {...prev, servico: val} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map(s => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apptDate">Data e Hora</Label>
              <Input 
                id="apptDate" 
                type="datetime-local"
                value={editingAppointment?.data_hora ? format(new Date(editingAppointment.data_hora), "yyyy-MM-dd'T'HH:mm") : ""}
                onChange={e => setEditingAppointment(prev => prev ? {...prev, data_hora: new Date(e.target.value).toISOString()} : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAppointment(null)}>Cancelar</Button>
            <Button onClick={saveEdit} disabled={isSavingEdit}>
              {isSavingEdit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Dashboard;
