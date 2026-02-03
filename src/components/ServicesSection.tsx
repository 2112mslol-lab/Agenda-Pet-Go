import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: string | number;
  price: string | number;
  icon?: any;
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Nossos Serviços
          </h2>
          <p className="text-muted-foreground">
            Selecione o serviço que deseja agendar
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => {
            const isSelected = selectedService === service.id;

            return (
              <button
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className={cn(
                  "group relative p-6 rounded-xl text-left transition-all duration-300",
                  "border-2 hover:shadow-card",
                  "animate-slide-up bg-card",
                  isSelected
                    ? "border-primary bg-accent shadow-card"
                    : "border-border hover:border-primary/50"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-primary animate-scale-in" />
                )}

                <h3 className="font-semibold text-foreground mb-1">
                  {service.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {service.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{service.duration}</span>
                  <span className="font-semibold text-primary">{service.price}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
