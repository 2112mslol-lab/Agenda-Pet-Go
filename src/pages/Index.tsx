import { Link } from "react-router-dom";
import { 
  PawPrint, 
  Calendar, 
  Users, 
  Settings, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Scissors,
  Check,
  LayoutDashboard,
  MessageCircleOff,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <SEO 
        title="AgendaPetGo | Sistema de Agendamento Online para Pet Shops" 
        description="Simplifique a gestão do seu banho e tosa. Reduza o WhatsApp e permita que seus clientes agendem online 24h por dia com nosso sistema para pet shop."
      />

      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <PawPrint className="text-white w-6 h-6" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">AgendaPetGo</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a href="#funcionalidades" className="hover:text-primary transition-colors">Funcionalidades</a>
            <a href="#precos" className="hover:text-primary transition-colors">Preços</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="font-bold">Entrar</Button>
            </Link>
            <Link to="/login">
              <Button className="font-black px-6 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 rounded-full">Experimentar Grátis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest mb-8 border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Gestão Profissional para Banho e Tosa
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">
              Sistema de Agendamento Online para Pet Shops
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Pare de perder tempo respondendo WhatsApp o dia todo. 
              Organize seu banho e tosa com uma agenda que trabalha sozinha 24h por dia.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button size="lg" className="h-16 px-10 text-xl font-black gap-3 shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 rounded-2xl w-full sm:w-auto">
                  Começar 14 dias grátis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#funcionalidades">
                <Button size="lg" variant="outline" className="h-16 px-10 text-xl font-bold border-slate-200 hover:bg-slate-50 rounded-2xl w-full sm:w-auto">
                  Ver como funciona
                </Button>
              </a>
            </div>
            
            <p className="mt-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
              Teste grátis por 14 dias – sem cartão
            </p>
          </div>
        </div>

        {/* Hero Illustration Placeholder */}
        <div className="mt-20 container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2rem] p-4 shadow-3xl border-8 border-slate-800">
                <div className="bg-slate-800 rounded-xl aspect-[16/9] flex items-center justify-center border border-white/5">
                    <LayoutDashboard className="w-20 h-20 text-white/10" />
                </div>
            </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-4">
              <p className="text-center text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Criado para pet shops que buscam organização</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                  <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6">
                          <Check className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Simplicidade Total</h3>
                      <p className="text-slate-500 text-sm">Configure seu pet shop em menos de 5 minutos.</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6">
                          <Users className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Foco no Cliente</h3>
                      <p className="text-slate-500 text-sm">Seu cliente agenda sozinho, sem precisar baixar apps.</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6">
                          <Star className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Suporte Próximo</h3>
                      <p className="text-slate-500 text-sm">Atendimento humano via WhatsApp para te ajudar.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Problem/Solution Section */}
      <section id="funcionalidades" className="py-32 bg-white">
          <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
                  <div>
                      <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight">
                          Diga adeus à confusão no WhatsApp do seu Pet Shop
                      </h2>
                      <div className="space-y-8">
                          <div className="flex gap-6">
                              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                                  <MessageCircleOff className="w-6 h-6 text-orange-600" />
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold mb-2">Menos mensagens repetitivas</h3>
                                  <p className="text-slate-500 leading-relaxed">
                                      Seu cliente não precisa mais perguntar "tem horário para hoje?". 
                                      Ele acessa seu link e escolhe o horário disponível em segundos.
                                  </p>
                              </div>
                          </div>
                          <div className="flex gap-6">
                              <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                                  <Clock className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold mb-2">Atendimento 24h por dia</h3>
                                  <p className="text-slate-500 leading-relaxed">
                                      Receba solicitações de banho e tosa mesmo quando seu pet shop estiver fechado. 
                                      Você apenas revisa e confirma no dia seguinte.
                                  </p>
                              </div>
                          </div>
                          <div className="flex gap-6">
                              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                  <Calendar className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold mb-2">Controle Total da Agenda</h3>
                                  <p className="text-slate-500 leading-relaxed">
                                      Visualize todos os agendamentos em um só lugar. 
                                      Saiba exatamente quem está vindo, qual o pet e qual o serviço.
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-200">
                      <div className="space-y-6">
                          <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs">O que você recebe:</h4>
                          <ul className="space-y-4">
                              <li className="flex items-center gap-3 font-bold text-slate-700">
                                  <Check className="w-5 h-5 text-primary" />
                                  Página de agendamento exclusiva
                              </li>
                              <li className="flex items-center gap-3 font-bold text-slate-700">
                                  <Check className="w-5 h-5 text-primary" />
                                  Gestão de profissionais e serviços
                              </li>
                              <li className="flex items-center gap-3 font-bold text-slate-700">
                                  <Check className="w-5 h-5 text-primary" />
                                  Confirmação automática via WhatsApp
                              </li>
                              <li className="flex items-center gap-3 font-bold text-slate-700">
                                  <Check className="w-5 h-5 text-primary" />
                                  Histórico completo de atendimentos
                              </li>
                          </ul>
                          <div className="pt-8">
                              <Link to="/login">
                                <Button className="w-full h-14 font-black rounded-2xl bg-slate-900 text-white">Criar minha agenda grátis</Button>
                              </Link>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 px-4">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Investimento Simples e Transparente</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">O valor de um banho por mês para ter seu pet shop organizado.</p>
          </div>

          <div className="max-w-xl mx-auto">
            {/* Pricing Card */}
            <div className="relative p-8 md:p-12 bg-white rounded-[3rem] shadow-2xl border-4 border-primary shadow-primary/20">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary text-white px-8 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-xl">
                PLANO ÚNICO PRO
              </div>

              <div className="mb-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-slate-900">R$ 29,90</span>
                    <span className="text-slate-400 font-bold text-xl">/mês</span>
                  </div>
                </div>
                <div className="mt-4 bg-emerald-50 text-emerald-700 py-2 px-6 rounded-xl inline-block font-black text-sm uppercase tracking-widest">
                  14 dias grátis – sem cartão
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <PricingItem text="Site de agendamento com seu logo" />
                <PricingItem text="Agendamentos ilimitados" />
                <PricingItem text="Gestão de banho, tosa e outros serviços" />
                <PricingItem text="Painel de controle simples" />
                <PricingItem text="Suporte por WhatsApp" />
                <PricingItem text="Sem contrato de fidelidade" />
              </div>

              <Link to="/login">
                <Button size="lg" className="w-full h-20 text-2xl font-black bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-2xl shadow-primary/30 transform hover:scale-[1.02] transition-all">
                  QUERO COMEÇAR AGORA
                </Button>
              </Link>

              <div className="mt-6 text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  CANCELE QUANDO QUISER
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured SEO Links (Footer Pre-section) */}
      <section className="py-20 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Link to="/agendamento-pet-shop" className="p-6 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group">
                      <h4 className="font-bold mb-2 group-hover:text-primary transition-colors text-slate-900">Agendamento para Pet Shop</h4>
                      <p className="text-xs text-slate-500 font-medium">Saiba como automatizar as marcações de horário no seu negócio.</p>
                  </Link>
                  <Link to="/agenda-online-banho-e-tosa" className="p-6 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group">
                      <h4 className="font-bold mb-2 group-hover:text-primary transition-colors text-slate-900">Agenda para Banho e Tosa</h4>
                      <p className="text-xs text-slate-500 font-medium">A solução ideal para organizar os serviços de estética animal.</p>
                  </Link>
                  <Link to="/sistema-para-pet-shop" className="p-6 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group">
                      <h4 className="font-bold mb-2 group-hover:text-primary transition-colors text-slate-900">Sistema para Pet Shop</h4>
                      <p className="text-xs text-slate-500 font-medium">Gestão simplificada e profissional para pequenos estabelecimentos.</p>
                  </Link>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <PawPrint className="text-white w-6 h-6" />
              </div>
              <span className="font-black text-2xl tracking-tighter">AgendaPetGo</span>
            </div>
            <div className="flex gap-12 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Suporte</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5 text-slate-600 text-sm">
            <p className="font-medium italic text-slate-500">A ferramenta essencial para o crescimento do seu Pet Shop.</p>
            <p className="font-bold uppercase tracking-widest text-[10px]">
              © 2026 AgendaPetGo. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PricingItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
      <Check className="w-3 h-3 text-emerald-600" />
    </div>
    <span className="text-slate-600 font-bold text-sm leading-tight">{text}</span>
  </div>
);

export default Index;
