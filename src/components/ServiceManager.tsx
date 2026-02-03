import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Scissors, DollarSign, Clock } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  price: number;
}

export const ServiceManager = ({ profileId }: { profileId: string }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    duration: 60,
    price: 0,
  });

  useEffect(() => {
    fetchServices();
  }, [profileId]);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("profile_id", profileId);

    if (error) {
      toast.error("Erro ao carregar serviços");
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const addService = async () => {
    if (!newService.title) return;
    setAdding(true);
    const { error } = await supabase.from("services").insert({
      profile_id: profileId,
      title: newService.title,
      description: newService.description,
      duration: newService.duration,
      price: newService.price,
    });

    if (error) {
      toast.error("Erro ao adicionar serviço");
    } else {
      toast.success("Serviço adicionado!");
      setNewService({ title: "", description: "", duration: 60, price: 0 });
      fetchServices();
    }
    setAdding(false);
  };

  const deleteService = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao remover serviço");
    } else {
      toast.success("Serviço removido");
      fetchServices();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Adicionar Novo Serviço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Serviço</label>
              <Input 
                value={newService.title} 
                onChange={(e) => setNewService({ ...newService, title: e.target.value })} 
                placeholder="Ex: Banho e Tosa Completa" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Preço (R$)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="number"
                  className="pl-9"
                  value={newService.price} 
                  onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })} 
                  placeholder="0.00" 
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Duração (Minutos)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="number"
                  className="pl-9"
                  value={newService.duration} 
                  onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })} 
                  placeholder="60" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição (Opcional)</label>
              <Textarea 
                value={newService.description} 
                onChange={(e) => setNewService({ ...newService, description: e.target.value })} 
                placeholder="Detalhes do serviço..." 
                className="h-10"
              />
            </div>
          </div>

          <Button onClick={addService} disabled={adding || !newService.title} className="w-full">
            {adding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {adding ? "Adicionando..." : "Adicionar Serviço"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin mx-auto col-span-full" />
        ) : services.length === 0 ? (
          <p className="text-muted-foreground text-center col-span-full py-8">
            Nenhum serviço cadastrado.
          </p>
        ) : (
          services.map((svc) => (
            <Card key={svc.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Scissors className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{svc.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{svc.description}</p>
                      <div className="flex gap-4 text-sm font-medium">
                        <span className="flex items-center gap-1 text-success">
                          <DollarSign className="w-3 h-3" />
                          R$ {svc.price}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {svc.duration} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteService(svc.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
