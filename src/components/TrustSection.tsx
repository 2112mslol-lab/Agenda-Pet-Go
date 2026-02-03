import { Star, ShieldCheck, PawPrint } from "lucide-react";

export const TrustSection = () => {
  const trustItems = [
    {
      icon: <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />,
      title: "Avaliação 5 Estrelas",
      description: "Atendimento bem avaliado"
    },
    {
      icon: <PawPrint className="w-6 h-6 text-primary" />,
      title: "Experiência Real",
      description: "Centenas de pets atendidos"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: "Reserva Garantida",
      description: "Agendamento 100% seguro"
    }
  ];

  return (
    <div className="py-12 bg-white/50 border-y border-slate-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 leading-tight">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
