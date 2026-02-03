import { Calendar, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  shopName?: string;
  backgroundUrl?: string | null;
}

export const HeroSection = ({ shopName, backgroundUrl }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden min-h-[500px] flex items-center">
      {/* Background Image with Overlay */}
      {backgroundUrl ? (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        >
          {/* Enhanced Overlay: A mix of dark overlay and stronger blur */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[4px]" />
          {/* Gradient to darken the bottom even more */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>
      ) : (
        <div className="absolute inset-0 gradient-hero opacity-10" />
      )}
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground backdrop-blur-md text-sm font-bold mb-8 border border-primary/30 shadow-lg">
            <Calendar className="w-4 h-4" />
            Agendamento Online
          </div>
          
          <h1 className={cn(
            "text-5xl md:text-7xl font-bold mb-8 leading-tight font-outfit drop-shadow-2xl",
            backgroundUrl ? "text-white" : "text-foreground"
          )}>
            {shopName ? (
                <>Bem-vindo ao <span className="text-primary">{shopName}</span></>
            ) : (
                <>Agende seu serviço de forma <span className="text-primary">rápida e fácil</span></>
            )}
          </h1>
          
          <p className={cn(
            "text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-md",
            backgroundUrl ? "text-white/90" : "text-muted-foreground"
          )}>
            Escolha o serviço, selecione a data e horário que preferir. 
            Simples assim. Sem ligações, sem espera.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors shadow-lg">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <span className={cn("font-bold", backgroundUrl ? "text-white drop-shadow-sm" : "text-foreground")}>Confirmação rápida</span>
            </div>
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors shadow-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <span className={cn("font-bold", backgroundUrl ? "text-white drop-shadow-sm" : "text-foreground")}>Disponível 24h</span>
            </div>
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors shadow-lg">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <span className={cn("font-bold", backgroundUrl ? "text-white drop-shadow-sm" : "text-foreground")}>Escolha sua data</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
