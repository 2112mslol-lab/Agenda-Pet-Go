import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2, PawPrint, Users, CreditCard, QrCode, Wallet, Banknote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeSlotPicker } from "./TimeSlotPicker";

const bookingSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().email("E-mail inválido").max(255),
  whatsapp: z
    .string()
    .min(10, "WhatsApp deve ter pelo menos 10 dígitos")
    .max(15)
    .regex(/^[0-9]+$/, "Apenas números"),
  petName: z.string().min(1, "Nome do pet é obrigatório").max(100),
  petSpecies: z.string().min(1, "Selecione a espécie").max(50),
  otherSpecies: z.string().max(50).optional(),
  professionalId: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface Service {
  id: string;
  name: string;
  price: string | number;
}

interface Professional {
  id: string;
  name: string;
}

interface BookingFormProps {
  selectedService: string;
  onSuccess: () => void;
  services: Service[];
  profileId?: string;
  schedulingRules?: {
    min_advance_hours: number;
    max_days_advance: number;
  };
  paymentSettings?: {
    accept_pix: boolean;
    pix_key: string;
    accept_card: boolean;
    payment_at_venue: boolean;
  };
}

export const BookingForm = ({ 
  selectedService, 
  onSuccess, 
  services, 
  profileId,
  schedulingRules,
  paymentSettings 
}: BookingFormProps) => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [internalSelectedService, setInternalSelectedService] = useState(selectedService || "");
  const [professionalServices, setProfessionalServices] = useState<{professional_id: string, service_id: string}[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
        petSpecies: "Cachorro",
        professionalId: "any"
    }
  });

  const petSpecies = watch("petSpecies");
  const currentProfessionalId = watch("professionalId");
  const selectedServiceData = services.find((s) => s.id === (internalSelectedService || selectedService));

  useEffect(() => {
    if (selectedService) {
      setInternalSelectedService(selectedService);
    }
  }, [selectedService]);

  useEffect(() => {
    if (profileId) {
      fetchProfessionals();
      fetchProfessionalServices();
    }
  }, [profileId, internalSelectedService]);

  const fetchProfessionalServices = async () => {
    const { data, error } = await supabase
      .from("professional_services")
      .select("*");
    
    if (!error && data) {
      setProfessionalServices(data);
    }
  };

  const fetchProfessionals = async () => {
    let query = supabase
      .from("professionals")
      .select("id, name")
      .eq("profile_id", profileId)
      .eq("is_active", true);

    const { data, error } = await query;

    if (!error && data) {
      // If a service is selected, filter professionals who can perform it
      if (internalSelectedService) {
        const eligibleProIds = professionalServices
          .filter(ps => ps.service_id === internalSelectedService)
          .map(ps => ps.professional_id);
        
        // If there are links, filter. If no links exist for this service yet, 
        // we might want to show all or none. Usually we show all if no rules are set,
        // but since we just added the feature, let's filter only if we have data.
        if (eligibleProIds.length > 0) {
          setProfessionals(data.filter(pro => eligibleProIds.includes(pro.id)));
        } else {
          setProfessionals(data);
        }
      } else {
        setProfessionals(data);
      }
    }
  };

  // Re-fetch professionals when service-pro links are loaded
  useEffect(() => {
    if (professionalServices.length > 0) {
      fetchProfessionals();
    }
  }, [professionalServices]);

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return numbers;
  };

  const currentWhatsApp = watch("whatsapp");

  const onSubmit = async (data: BookingFormData) => {
    const finalServiceId = internalSelectedService || selectedService;
    if (!finalServiceId) {
      toast.error("Por favor, selecione um serviço");
      const el = document.getElementById('services');
      el?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!date) {
      toast.error("Por favor, selecione uma data");
      return;
    }

    if (!time) {
      toast.error("Por favor, selecione um horário");
      return;
    }

    setIsSubmitting(true);

    try {
      const [hours, minutes] = time.split(":").map(Number);
      const dateTime = new Date(date);
      dateTime.setHours(hours, minutes, 0, 0);

      const { error } = await supabase.from("agendamentos").insert({
        nome_cliente: data.nome,
        email: data.email,
        whatsapp: data.whatsapp.replace(/\D/g, ""),
        pet_name: data.petName,
        pet_species: data.petSpecies === "Outro" && data.otherSpecies ? data.otherSpecies : data.petSpecies,
        professional_id: data.professionalId === "any" ? null : data.professionalId,
        servico: selectedServiceData?.name || finalServiceId,
        service_id: selectedServiceData?.id,
        profile_id: profileId,
        data_hora: dateTime.toISOString(),
        status: "pendente",
        valor: Number(selectedServiceData?.price || 0),
      });

      if (error) {
          if (error.message.includes("já possui um agendamento")) {
              throw new Error("Este horário já foi preenchido por outro cliente. Por favor, escolha outro horário ou profissional.");
          }
          throw error;
      }

      toast.success("Agendamento solicitado com sucesso!");
      onSuccess();
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast.error(error.message || "Erro ao criar agendamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-100" id="booking">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tighter">
              Finalize seu Agendamento
            </h2>
            <p className="text-slate-500 text-lg">
              Preencha os dados abaixo e entraremos em contato.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-slate-50/50 p-6 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="space-y-3">
              <Label className="text-sm font-black uppercase tracking-widest text-slate-400">1. Qual serviço seu pet precisa?</Label>
              <Select 
                onValueChange={(val) => setInternalSelectedService(val)} 
                value={internalSelectedService}
              >
                <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-white shadow-sm text-lg font-medium">
                  <SelectValue placeholder="Toque para escolher o serviço" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="py-3">
                      {s.name} - R$ {s.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
                <Label className="text-sm font-black uppercase tracking-widest text-slate-400">2. Seus dados de contato</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Input
                            id="nome"
                            placeholder="Seu nome completo"
                            {...register("nome")}
                            className={cn("h-14 rounded-2xl border-slate-200 bg-white transition-all focus:ring-primary", errors.nome && "border-destructive")}
                        />
                        {errors.nome && (
                            <p className="text-xs text-destructive font-bold">{errors.nome.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Input
                            id="whatsapp"
                            placeholder="Seu WhatsApp (00) 00000-0000"
                            {...register("whatsapp")}
                            onChange={(e) => {
                                const masked = formatWhatsApp(e.target.value);
                                setValue("whatsapp", masked);
                            }}
                            className={cn("h-14 rounded-2xl border-slate-200 bg-white transition-all focus:ring-primary", errors.whatsapp && "border-destructive")}
                        />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter ml-1">
                            Enviaremos a confirmação automática pelo WhatsApp
                        </p>
                        {errors.whatsapp && (
                            <p className="text-xs text-destructive font-bold">{errors.whatsapp.message}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com (opcional)"
                        {...register("email")}
                        className={cn("h-14 rounded-2xl border-slate-200 bg-white transition-all focus:ring-primary", errors.email && "border-destructive")}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2 text-slate-900">
                    <PawPrint className="w-5 h-5 text-primary" />
                    <Label className="text-sm font-black uppercase tracking-widest text-slate-400">3. Sobre o Pet</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Input
                        id="petName"
                        placeholder="Nome do seu Pet"
                        {...register("petName")}
                        className={cn("h-14 rounded-2xl border-slate-200 bg-white transition-all focus:ring-primary", errors.petName && "border-destructive")}
                      />
                      {errors.petName && (
                        <p className="text-xs text-destructive font-bold">{errors.petName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Select 
                        onValueChange={(val) => setValue("petSpecies", val)} 
                        defaultValue="Cachorro"
                      >
                        <SelectTrigger className={cn("h-14 rounded-2xl border-slate-200 bg-white transition-all focus:ring-primary", errors.petSpecies && "border-destructive")}>
                          <SelectValue placeholder="Espécie" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="Cachorro">Cachorro 🐶</SelectItem>
                          <SelectItem value="Gato">Gato 🐱</SelectItem>
                          <SelectItem value="Outro">Outro ✨</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.petSpecies && (
                        <p className="text-xs text-destructive font-bold">{errors.petSpecies.message}</p>
                      )}
                    </div>

                    {petSpecies === "Outro" && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Input
                          id="otherSpecies"
                          placeholder="Qual a espécie? (Ex: Coelho)"
                          {...register("otherSpecies")}
                          className={cn("h-14 rounded-2xl border-slate-200 bg-white transition-all focus:ring-primary", errors.otherSpecies && "border-destructive")}
                        />
                        {errors.otherSpecies && (
                          <p className="text-xs text-destructive font-bold">{errors.otherSpecies.message}</p>
                        )}
                      </div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <Label className="text-sm font-black uppercase tracking-widest text-slate-400">4. Quando deseja o atendimento?</Label>
                
                {professionals.length > 0 && (
                    <div className="space-y-2">
                    <Select 
                        onValueChange={(val) => setValue("professionalId", val)}
                        value={currentProfessionalId}
                    >
                        <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-white shadow-sm font-medium">
                        <SelectValue placeholder="Qualquer profissional" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                        <SelectItem value="any">Qualquer profissional (mais rápido)</SelectItem>
                        {professionals.map((pro) => (
                            <SelectItem key={pro.id} value={pro.id}>{pro.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant="outline"
                        className={cn(
                            "w-full h-14 justify-start text-left font-medium rounded-2xl border-slate-200 bg-white shadow-sm",
                            !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                        {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar Data"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden" align="start">
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) =>
                            date < new Date(new Date().setHours(0,0,0,0))
                        }
                        initialFocus
                        locale={ptBR}
                        />
                    </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-2">
                    <TimeSlotPicker 
                        date={date}
                        selectedTime={time}
                        onTimeSelect={setTime}
                        schedulingRules={schedulingRules}
                        professionalId={currentProfessionalId === "any" ? undefined : currentProfessionalId}
                    />
                </div>
                </div>
            </div>

            <Button
              type="submit"
              className="w-full h-16 text-xl font-black rounded-[2rem] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
              disabled={isSubmitting || !date || !time}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Processando...
                </>
              ) : (
                "Agendar agora"
              )}
            </Button>

            {!internalSelectedService && (
              <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                Selecione um serviço para liberar o botão
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      {!internalSelectedService && (
        <a 
            href="#services"
            className="md:hidden fixed bottom-6 right-6 left-6 z-40"
        >
            <Button className="w-full h-14 rounded-full shadow-2xl shadow-primary/40 font-black uppercase tracking-widest animate-bounce">
                Ver Serviços & Agendar
            </Button>
        </a>
      )}
    </section>
  );
};

