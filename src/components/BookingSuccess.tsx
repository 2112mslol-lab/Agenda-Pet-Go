import { CheckCircle, Clock, ArrowLeft, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingSuccessProps {
  onNewBooking: () => void;
}

export const BookingSuccess = ({ onNewBooking }: BookingSuccessProps) => {
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 bg-white">
      <div className="max-w-md w-full text-center animate-scale-in">
        <div className="relative w-24 h-24 mx-auto mb-8">
           <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
           <div className="relative w-full h-full rounded-full bg-primary flex items-center justify-center shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
           </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tighter">
          Tudo Pronto! 🐶✨
        </h1>

        <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl mb-8 text-left space-y-6">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 leading-none mb-1 text-sm uppercase tracking-widest">Status</h3>
                    <p className="text-orange-600 text-lg font-black">Aguardando confirmação</p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Send className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 leading-none mb-1 text-sm uppercase tracking-widest">Próximo Passo</h3>
                    <p className="text-slate-600 font-medium">O pet shop recebeu seu pedido e irá analisar o horário disponível.</p>
                </div>
            </div>

            <hr className="border-slate-200" />

            <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Tempo médio de resposta</span>
                <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Até 1 hora</span>
            </div>
        </div>

        <p className="text-slate-500 mb-10 font-medium px-4">
          Fique atento ao seu WhatsApp. Enviaremos uma mensagem assim que seu agendamento for confirmado!
        </p>

        <Button
          onClick={onNewBooking}
          variant="ghost"
          className="gap-2 text-slate-400 hover:text-primary transition-colors font-bold rounded-2xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Fazer novo agendamento
        </Button>
      </div>
    </div>
  );
};
