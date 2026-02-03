import { Link } from "react-router-dom";
import { 
  PawPrint, 
  Calendar, 
  Users, 
  Settings, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Scissors
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <PawPrint className="text-white w-7 h-7" />
            </div>
            <span className="font-bold text-2xl tracking-tighter">AgendaPetGo</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">Entrar</Button>
            </Link>
            <Link to="/login">
              <Button className="font-bold px-6 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30">Criar minha Conta</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Pet Shop Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground backdrop-blur-md text-sm font-bold uppercase tracking-widest mb-8 animate-fade-in border border-primary/30">
              <ShieldCheck className="w-4 h-4" />
              Plataforma Profissional 2026
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] animate-slide-up tracking-tighter">
              A Sua <br />
              <span className="text-primary">Agenda Digital</span> <br />
              Inteligente
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-200 max-w-xl mb-12 animate-slide-up font-medium leading-relaxed" style={{ animationDelay: '100ms' }}>
              Reduza o WhatsApp manual e automatize seu Pet Shop em minutos. 
              Dê ao seu cliente a facilidade de agendar online 24/7.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/login">
                <Button size="lg" className="h-16 px-10 text-xl font-black gap-3 group shadow-2xl shadow-primary/40 bg-primary hover:bg-primary/90">
                  Começar 14 dias grátis
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-16 px-10 text-xl font-bold bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                Conhecer o Plano
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 px-4">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">O Plano Perfeito para Você</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">Tudo o que seu Pet Shop precisa em um único lugar.</p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="relative p-8 md:p-12 bg-white rounded-[2.5rem] shadow-2xl border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute top-0 right-12 transform -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-xl">
                🔥 Mais Popular
              </div>

              <div className="mb-8">
                <h3 className="text-3xl font-black mb-2 italic">PetAgendaHub</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-primary">R$29,90</span>
                  <span className="text-slate-500 font-bold">/mês</span>
                </div>
                <p className="text-primary font-bold mt-2">14 dias grátis para testar</p>
              </div>

              <div className="space-y-4 mb-10">
                <PricingItem text="Site profissional customizado com seu logo" />
                <PricingItem text="Agendamento online 24/7 (sem WhatsApp manual)" />
                <PricingItem text="Confirmações automáticas WhatsApp" />
                <PricingItem text="Dashboard com todos agendamentos" />
                <PricingItem text="Suporte WhatsApp ilimitado" />
              </div>

              <Link to="/login">
                <Button size="lg" className="w-full h-16 text-xl font-black bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl shadow-slate-200">
                  Assinar Agora
                </Button>
              </Link>

              <div className="mt-6 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">
                  CANCELAR QUALQUER MOMENTO - SEM MULTA
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 text-white border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <PawPrint className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tighter">AgendaPetGo</span>
            </div>
            <div className="flex gap-8 text-slate-400 font-medium">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Suporte</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5 text-slate-500 text-sm">
            <p className="italic">"A melhor experiência de agendamento para o mercado Pet."</p>
            <p className="font-medium">
              © 2026 AgendaPetGo. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="p-8 bg-card border border-border rounded-3xl hover:border-primary/50 transition-colors group">
    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const PricingItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
      <Check className="w-3 h-3 text-emerald-600" />
    </div>
    <span className="text-slate-700 font-medium leading-tight">{text}</span>
  </div>
);

export default Index;
