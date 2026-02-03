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
      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <PawPrint className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight">BookingBuddy</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/login">
              <Button className="font-semibold shadow-lg shadow-primary/20">Criar minha Conta</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 -z-10 w-1/3 h-1/2 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 -z-10 w-1/4 h-1/3 bg-success/10 blur-[100px] rounded-full" />
        
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
            <ShieldCheck className="w-3 h-3" />
            O Micro-SaaS definitivo para Pet Shops
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-slide-up">
            Gerencie seu Pet Shop <br />
            <span className="text-primary">sem complicação</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Agenda online inteligente, controle de profissionais, cadastro de pets e tudo que você precisa para crescer seu negócio em um só lugar.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link to="/login">
              <Button size="lg" className="h-14 px-8 text-lg font-bold gap-2 group">
                Começar agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium">
              Ver demonstração
            </Button>
          </div>

          {/* Social Proof Placeholder */}
          <div className="mt-16 pt-10 border-t border-border animate-fade-in">
            <p className="text-sm font-medium text-muted-foreground mb-6">CONFIADO POR MAIS DE 500+ PET SHOPS PELO BRASIL</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale contrast-125">
              <span className="font-black text-2xl">PETLOVE</span>
              <span className="font-black text-2xl">PETZ</span>
              <span className="font-black text-2xl">COBASI</span>
              <span className="font-black text-2xl">DOGHERO</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo sob seu controle</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Funcionalidades pensadas no dia a dia do seu negócio pet.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Calendar className="w-6 h-6" />}
              title="Agenda 24h"
              description="Seus clientes agendam serviços a qualquer hora, reduzindo seu trabalho manual."
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6" />}
              title="Gestão de Equipe"
              description="Controle os horários e especialidades de cada profissional do seu pet shop."
            />
            <FeatureCard 
              icon={<Scissors className="w-6 h-6" />}
              title="Serviços Customizados"
              description="Defina preços e durações personalizadas para banho, tosa, veterinário e mais."
            />
            <FeatureCard 
              icon={<Clock className="w-6 h-6" />}
              title="Sem Conflitos"
              description="Sistema inteligente que impede agendamentos em horários já ocupados."
            />
            <FeatureCard 
              icon={<Settings className="w-6 h-6" />}
              title="Painel Completo"
              description="Gestão visual intuitiva para gerenciar status de agendamentos e cadastros."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Segurança SaaS"
              description="Dados isolados e protegidos com tecnologia Cloud de última geração."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <PawPrint className="text-primary w-5 h-5" />
            <span className="font-bold">BookingBuddy</span>
          </div>
          <p className="text-sm text-muted-foreground italic">
            "Facilitando a vida dos tutores e pet shops"
          </p>
          <p className="text-sm text-muted-foreground">
            © 2025 BookingBuddy. Todos os direitos reservados.
          </p>
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

export default Index;
