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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const isSelected = selectedService === service.id;
            const IconComponent = (service.icon_name && ICON_MAP[service.icon_name]) || Scissors;

            return (
              <button
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className={cn(
                  "group relative p-6 rounded-2xl text-left transition-all duration-300",
                  "border-2 bg-card",
                  "animate-slide-up hover:shadow-xl",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-5">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-lg mb-1 truncate">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between text-sm mt-auto">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-primary text-base">
                        R$ {service.price}
                      </div>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
