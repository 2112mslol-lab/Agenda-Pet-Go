import { cn } from "@/lib/utils";
import { 
  Scissors, 
  Bath, 
  Waves, 
  Stethoscope, 
  Syringe, 
  Bone, 
  Heart, 
  Dog, 
  Cat,
  Clock,
  DollarSign
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Scissors,
  Bath,
  Waves,
  Stethoscope,
  Syringe,
  Bone,
  Heart,
  Dog,
  Cat,
};

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: string | number;
  price: string | number;
  icon_name?: string;
}

interface ServicesSectionProps {
  services: Service[];
  selectedService: string;
  onSelectService: (serviceId: string) => void;
}

export const ServicesSection = ({
  services,
  selectedService,
  onSelectService,
}: ServicesSectionProps) => {
  if (services.length === 0) return null;

  return (
    <section className="py-12 md:py-16" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 font-outfit">
            Nossos Serviços
          </h2>
          <p className="text-muted-foreground">
            Selecione o serviço que deseja agendar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const isSelected = selectedService === service.id;
            const IconComponent = (service.icon_name && ICON_MAP[service.icon_name]) || Scissors;

            return (
              <button
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className={cn(
                  "group relative p-2 rounded-[2rem] text-left transition-all duration-500",
                  "border-2",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-2xl shadow-primary/20 scale-[1.02] z-10"
                    : "border-slate-100 bg-white hover:border-primary/30 hover:shadow-xl"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6 h-full flex flex-col">
                  {index === 0 && !isSelected && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-xl">
                      Mais Procurado
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500",
                      isSelected ? "bg-primary text-white rotate-6" : "bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 text-xl leading-tight">
                        {service.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                            <Clock className="w-3 h-3" />
                            {service.duration}
                        </div>
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm mb-8 line-clamp-2 min-h-[40px] leading-relaxed">
                    {service.description || "Atendimento completo e personalizado para o bem-estar do seu melhor amigo."}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="text-2xl font-black text-primary">
                      <span className="text-sm font-bold opacity-50 mr-1">R$</span>
                      {service.price}
                    </div>
                    <div className={cn(
                        "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white"
                    )}>
                        {isSelected ? 'Selecionado' : 'Escolher'}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
