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
  Image as ImageIcon
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
  const [showSetup, setShowSetup] = useState(false);
  const [shopName, setShopName] = useState("");
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  
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
         setShowSetup(true);
      } else {
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
      }
    };

    checkAuth();
  }, [navigate]);

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
              <span className="hidden lg:inline">Configurações</span>
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
                {appointments.map((appointment) => {
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
                    <div className="flex items-center justify-between p-4 border rounded-xl">
                      <div className="space-y-0.5">
                        <Label>Novo Agendamento</Label>
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
                    <div className="flex items-center justify-between p-4 border rounded-xl">
                      <div className="space-y-0.5">
                        <Label>Lembrete 4h antes</Label>
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
                    <div className="flex items-center justify-between p-4 border rounded-xl">
                      <div className="space-y-0.5">
                        <Label>Aviso Dia Anterior</Label>
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
                  <CardFooter className="bg-muted/30 p-4 rounded-b-xl flex justify-end">
                    <Button onClick={handleUpdateSettings} disabled={isUpdatingSettings} className="gap-2 font-bold px-8 h-11">
                      {isUpdatingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      Salvar Configurações
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        )}
      </main>
    </div>
  );
};
export default Dashboard;
