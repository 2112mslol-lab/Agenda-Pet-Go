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
        petSpecies: "Cachorro"
    }
  });

  const petSpecies = watch("petSpecies");
  const selectedServiceData = services.find((s) => s.id === selectedService);

  useEffect(() => {
    if (profileId) {
      fetchProfessionals();
    }
  }, [profileId]);

  const fetchProfessionals = async () => {
    const { data, error } = await supabase
      .from("professionals")
      .select("id, name")
      .eq("profile_id", profileId)
      .eq("is_active", true);

    if (!error && data) {
      setProfessionals(data);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedService) {
      toast.error("Por favor, selecione um serviço");
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
        whatsapp: data.whatsapp,
        pet_name: data.petName,
        pet_species: data.petSpecies,
        professional_id: data.professionalId || null,
        servico: selectedServiceData?.name || selectedService,
        service_id: selectedServiceData?.id,
        profile_id: profileId,
        data_hora: dateTime.toISOString(),
        status: "pendente",
        valor: selectedServiceData?.price || 0,
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
    <section className="py-12 md:py-16 bg-card border-t border-border" id="booking">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Complete seu Agendamento
            </h2>
            <p className="text-muted-foreground">
              Preencha os dados abaixo para solicitar seu horário
            </p>
          </div>

          {selectedService && selectedServiceData && (
            <div className="mb-6 p-4 rounded-lg bg-accent border border-primary/20 animate-scale-in">
              <p className="text-sm text-muted-foreground mb-1">Serviço selecionado:</p>
              <p className="font-semibold text-foreground">
                {selectedServiceData.name} - R$ {selectedServiceData.price}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Seu Nome</Label>
                  <Input
                    id="nome"
                    placeholder="Seu nome"
                    {...register("nome")}
                    className={cn(errors.nome && "border-destructive")}
                  />
                  {errors.nome && (
                    <p className="text-sm text-destructive">{errors.nome.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">Seu WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    placeholder="11999999999"
                    {...register("whatsapp")}
                    className={cn(errors.whatsapp && "border-destructive")}
                  />
                  {errors.whatsapp && (
                    <p className="text-sm text-destructive">{errors.whatsapp.message}</p>
                  )}
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                className={cn(errors.email && "border-destructive")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <hr className="border-border my-8" />
            
            <div className="flex items-center gap-2 mb-2 text-primary">
                <PawPrint className="w-5 h-5" />
                <h3 className="font-bold">Informações do Pet</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="petName">Nome do Pet</Label>
                  <Input
                    id="petName"
                    placeholder="Ex: Totó"
                    {...register("petName")}
                    className={cn(errors.petName && "border-destructive")}
                  />
                  {errors.petName && (
                    <p className="text-sm text-destructive">{errors.petName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Espécie</Label>
                  <Select 
                    onValueChange={(val) => setValue("petSpecies", val)} 
                    defaultValue="Cachorro"
                  >
                    <SelectTrigger className={cn(errors.petSpecies && "border-destructive")}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cachorro">Cachorro</SelectItem>
                      <SelectItem value="Gato">Gato</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.petSpecies && (
                    <p className="text-sm text-destructive">{errors.petSpecies.message}</p>
                  )}
                </div>
            </div>

            <hr className="border-border my-8" />
            
            <div className="flex items-center gap-2 mb-2 text-primary">
                <Users className="w-5 h-5" />
                <h3 className="font-bold">Agendamento</h3>
            </div>

            {professionals.length > 0 && (
                <div className="space-y-2">
                  <Label>Selecione o Profissional (Opcional)</Label>
                  <Select onValueChange={(val) => setValue("professionalId", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Qualquer profissional</SelectItem>
                      {professionals.map((pro) => (
                        <SelectItem key={pro.id} value={pro.id}>{pro.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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
                 <Label>Horário Disponível</Label>
                 <TimeSlotPicker 
                    date={date}
                    selectedTime={time}
                    onTimeSelect={setTime}
                    schedulingRules={schedulingRules}
                 />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01]"
              disabled={isSubmitting || !date || !time}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Finalizando...
                </>
              ) : (
                "Confirmar Agendamento"
              )}
            </Button>

            {!selectedService && (
              <p className="text-center text-sm text-muted-foreground">
                Selecione um serviço acima para continuar
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

