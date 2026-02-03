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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary selection:text-white">
      <SEO 
        title="AgendaPetGo | Sistema de Agendamento Online para Pet Shops" 
        description="Simplifique a gestão do seu banho e tosa. Reduza o WhatsApp e permita que seus clientes agendem online 24h por dia com nosso sistema para pet shop."
      />

      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
             <img src="/logo.png" alt="AgendaPetGo" className="h-12 w-auto object-contain" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <a href="#funcionalidades" className="hover:text-primary transition-colors">Funcionalidades</a>
            <a href="#precos" className="hover:text-primary transition-colors">Preços</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="font-bold text-slate-600">Entrar</Button>
            </Link>
            <Link to="/login">
              <Button className="font-black px-6 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 rounded-full transition-all hover:scale-105 active:scale-95">Experiência Grátis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Interior de um Pet Shop Profissional" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/95 to-white/40 md:to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-primary/20 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4" />
              Líder em Gestão para Banho e Tosa
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
              Sistema de Agendamento <br />
              <span className="text-primary italic">Online</span> para <br />
              Pet Shops
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mb-12 font-medium leading-relaxed">
              Elimine o caos do WhatsApp. Deixe seus clientes agendarem sozinhos e foque no que importa: <span className="text-slate-900 font-bold underline decoration-primary/30">o bem-estar dos pets</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" className="h-16 px-10 text-xl font-black gap-3 shadow-2xl shadow-primary/40 bg-primary hover:bg-primary/90 rounded-2xl w-full">
                  Começar 14 dias grátis
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#funcionalidades" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-16 px-10 text-xl font-bold border-slate-300 hover:bg-slate-50 rounded-2xl w-full bg-white/50 backdrop-blur-sm">
                  Ver como funciona
                </Button>
              </a>
            </div>
            
            <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                            <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="Usuário" />
                        </div>
                    ))}
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    <span className="text-primary">+500</span> donos de pet shops já utilizam
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
          <div className="container mx-auto px-4 relative z-10">
              <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-16">Organização e Profissionalismo</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
                  <div className="flex flex-col items-center text-center group">
                      <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center mb-8 transition-all group-hover:bg-primary/20 group-hover:border-primary/50">
                          <Check className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="font-black text-xl mb-3 tracking-tight">Simplicidade de Uso</h3>
                      <p className="text-slate-400 text-base leading-relaxed">Feito para quem não tem tempo a perder com sistemas complexos.</p>
                  </div>
                  <div className="flex flex-col items-center text-center group">
                      <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center mb-8 transition-all group-hover:bg-primary/20 group-hover:border-primary/50">
                          <Users className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="font-black text-xl mb-3 tracking-tight">Foco Total no Tutor</h3>
                      <p className="text-slate-400 text-base leading-relaxed">Seu cliente agenda em segundos, sem precisar baixar nenhum aplicativo.</p>
                  </div>
                  <div className="flex flex-col items-center text-center group">
                      <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center mb-8 transition-all group-hover:bg-primary/20 group-hover:border-primary/50">
                          <Star className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="font-black text-xl mb-3 tracking-tight">Suporte Prioritário</h3>
                      <p className="text-slate-400 text-base leading-relaxed">Estamos ao seu lado via WhatsApp para resolver qualquer dúvida em minutos.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Problem/Solution Section */}
      <section id="funcionalidades" className="py-32 bg-slate-50/50 relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform origin-top translate-x-20 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
                  <div>
                      <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight">
                          Diga adeus à confusão no WhatsApp do seu Pet Shop
                      </h2>
                      <div className="space-y-8">
                          <div className="flex gap-6 p-6 rounded-3xl transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 group">
                              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
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
                          <div className="flex gap-6 p-6 rounded-3xl transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 group">
                              <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
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
                          <div className="flex gap-6 p-6 rounded-3xl transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 group">
                              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
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
                  <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-2xl shadow-slate-200">
                      <div className="space-y-6">
                          <h4 className="font-black text-primary uppercase tracking-[0.3em] text-[10px] mb-4">O que você recebe imediatamente:</h4>
                          <ul className="space-y-4">
                              <li className="flex items-center gap-4 font-bold text-slate-700">
                                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                      <Check className="w-4 h-4 text-emerald-600" />
                                  </div>
                                  Página de agendamento exclusiva
                              </li>
                              <li className="flex items-center gap-4 font-bold text-slate-700">
                                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                      <Check className="w-4 h-4 text-emerald-600" />
                                  </div>
                                  Gestão de profissionais e serviços
                              </li>
                              <li className="flex items-center gap-4 font-bold text-slate-700">
                                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                      <Check className="w-4 h-4 text-emerald-600" />
                                  </div>
                                  Confirmação automática via WhatsApp
                              </li>
                              <li className="flex items-center gap-4 font-bold text-slate-700">
                                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                      <Check className="w-4 h-4 text-emerald-600" />
                                  </div>
                                  Histórico completo de atendimentos
                              </li>
                          </ul>
                          <div className="pt-8 text-center md:text-left">
                              <Link to="/login">
                                <Button className="h-16 px-8 font-black rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl">Criar minha agenda agora</Button>
                              </Link>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-32 bg-slate-100 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900">Investimento Simples e Transparente</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">O valor de um banho por mês para ter seu pet shop organizado e profissional.</p>
          </div>

          <div className="max-w-xl mx-auto">
            {/* Pricing Card */}
            <div className="relative p-10 md:p-14 bg-white rounded-[4rem] shadow-2xl border-4 border-primary shadow-primary/20">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary text-white px-10 py-3 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl">
                PLANO ÚNICO PRO
              </div>

              <div className="mb-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-black text-slate-900 tracking-tighter">R$ 29,90</span>
                    <span className="text-slate-400 font-bold text-xl">/mês</span>
                  </div>
                </div>
                <div className="mt-6 bg-emerald-50 text-emerald-700 py-3 px-8 rounded-2xl inline-block font-black text-xs uppercase tracking-widest border border-emerald-100">
                   Incluso: 14 dias grátis – sem cartão
                </div>
              </div>

              <div className="space-y-6 mb-12">
                <PricingItem text="Site de agendamento com seu logo" />
                <PricingItem text="Agendamentos ilimitados" />
                <PricingItem text="Gestão de banho, tosa e outros serviços" />
                <PricingItem text="Painel de controle intuitivo" />
                <PricingItem text="Suporte humano via WhatsApp" />
                <PricingItem text="Sem contrato ou taxas de cancelamento" />
              </div>

              <Link to="/login">
                <Button size="lg" className="w-full h-20 text-2xl font-black bg-primary hover:bg-primary/90 text-white rounded-[2rem] shadow-2xl shadow-primary/40 transform hover:scale-105 transition-all active:scale-95 uppercase tracking-widest">
                  QUERO COMEÇAR AGORA
                </Button>
              </Link>

              <div className="mt-8 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  SATISFAÇÃO GARANTIDA OU CANCELAMENTO LIVRE
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
