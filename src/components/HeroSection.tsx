import { Calendar, Clock, CheckCircle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  shopName?: string;
  backgroundUrl?: string | null;
}

export const HeroSection = ({ shopName, backgroundUrl }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden min-h-[450px] md:min-h-[550px] flex items-center">
      {/* Background Image with Overlay */}
      {backgroundUrl ? (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-slate-50">
          <div className="absolute inset-0 gradient-hero opacity-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
             <Heart className="w-[500px] h-[500px] text-primary" />
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/20 text-white backdrop-blur-md text-xs font-black uppercase tracking-widest mb-8 border border-white/20 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Agenda Aberta
          </div>
          
          <h1 className={cn(
            "text-5xl md:text-8xl font-black mb-6 leading-tight font-outfit tracking-tighter drop-shadow-2xl",
            backgroundUrl ? "text-white" : "text-slate-900"
          )}>
            {shopName ? (
                <span className="block mb-2">Bem-vindo ao <br /><span className="text-primary italic">{shopName}</span></span>
            ) : (
                <span className="block mb-2">Cuide do seu Melhor Amigo</span>
            )}
          </h1>
          
          <p className={cn(
            "text-xl md:text-3xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-lg",
            backgroundUrl ? "text-white/90" : "text-slate-600"
          )}>
            Agende o banho ou tosa do seu pet em poucos cliques. 
            <span className="block text-primary font-bold mt-2">Simples, rápido e sem burocracia.</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 group bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className={cn("font-bold", backgroundUrl ? "text-white" : "text-slate-700")}>Confirmação via WhatsApp</span>
            </div>
            <div className="flex items-center gap-2 group bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
              <Clock className="w-5 h-5 text-primary" />
              <span className={cn("font-bold", backgroundUrl ? "text-white" : "text-slate-700")}>Atendimento Premium</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
