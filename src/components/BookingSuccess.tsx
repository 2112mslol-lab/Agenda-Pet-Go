import { CheckCircle, Clock, ArrowLeft, QrCode, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface BookingSuccessProps {
  onNewBooking: () => void;
  paymentMethod?: string;
  paymentSettings?: {
    pix_key?: string;
  };
}

export const BookingSuccess = ({ onNewBooking, paymentMethod, paymentSettings }: BookingSuccessProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPix = () => {
    if (paymentSettings?.pix_key) {
      navigator.clipboard.writeText(paymentSettings.pix_key);
      setCopied(true);
      toast.success("Chave PIX copiada!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isPix = paymentMethod === "pix";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-scale-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Solicitação Enviada!
        </h1>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning mb-6">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Aguardando Confirmação</span>
        </div>

        <p className="text-muted-foreground mb-8">
          Recebemos sua solicitação de agendamento. O prestador irá analisar e
          confirmar em breve. Você receberá uma notificação assim que for
          confirmado.
        </p>

        {isPix && paymentSettings?.pix_key && (
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-6 h-6 text-primary" />
             </div>
             <h3 className="font-bold text-foreground mb-1">Pagamento via PIX</h3>
             <p className="text-xs text-muted-foreground mb-4">Copie a chave abaixo para realizar o pagamento</p>
             
             <div className="flex flex-col gap-3">
               <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-border shadow-sm">
                 <code className="text-xs font-mono font-bold text-slate-700 truncate mr-2">
                   {paymentSettings.pix_key}
                 </code>
                 <Button 
                   size="icon" 
                   variant="ghost" 
                   className="h-8 w-8 shrink-0"
                   onClick={handleCopyPix}
                 >
                   {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                 </Button>
               </div>
               <p className="text-[10px] text-muted-foreground italic">
                 * Envie o comprovante via WhatsApp após o pagamento.
               </p>
             </div>
          </div>
        )}

        <Button
          onClick={onNewBooking}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Fazer novo agendamento
        </Button>
      </div>
    </div>
  );
};
