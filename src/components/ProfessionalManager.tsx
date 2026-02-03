import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, User } from "lucide-react";

interface Service {
  id: string;
  title: string;
}

interface Professional {
  id: string;
  name: string;
  specialty: string | null;
  is_active: boolean;
  services?: string[]; // IDs of services they perform
}

export const ProfessionalManager = ({ profileId }: { profileId: string }) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isUpdatingPro, setIsUpdatingPro] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [profileId]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch professionals
    const { data: proData, error: proError } = await supabase
      .from("professionals")
      .select("*")
      .eq("profile_id", profileId);

    // Fetch services
    const { data: servData, error: servError } = await supabase
      .from("services")
      .select("id, title")
      .eq("profile_id", profileId);

    // Fetch links
    const { data: linkData, error: linkError } = await supabase
      .from("professional_services")
      .select("*");

    if (proError || servError) {
      toast.error("Erro ao carregar dados");
    } else {
      const prosWithServices = (proData || []).map(pro => ({
        ...pro,
        services: (linkData || [])
          .filter(link => link.professional_id === pro.id)
          .map(link => link.service_id)
      }));
      setProfessionals(prosWithServices);
      setServices(servData || []);
    }
    setLoading(false);
  };

  const addProfessional = async () => {
    if (!newName) return;
    setAdding(true);
    
    const { data, error } = await supabase.from("professionals").insert({
      profile_id: profileId,
      name: newName,
      specialty: newSpecialty,
    }).select().single();

    if (error) {
      toast.error("Erro ao adicionar profissional");
    } else if (data && selectedServices.length > 0) {
      // Add service links
      const links = selectedServices.map(serviceId => ({
        professional_id: data.id,
        service_id: serviceId
      }));
      await supabase.from("professional_services").insert(links);
      
      toast.success("Profissional adicionado!");
      setNewName("");
      setNewSpecialty("");
      setSelectedServices([]);
      fetchData();
    } else {
      toast.success("Profissional adicionado!");
      setNewName("");
      setNewSpecialty("");
      fetchData();
    }
    setAdding(false);
  };

  const deleteProfessional = async (id: string) => {
    const { error } = await supabase.from("professionals").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao remover profissional");
    } else {
      toast.success("Profissional removido");
      fetchData();
    }
  };

  const toggleService = async (proId: string, serviceId: string, isLinked: boolean) => {
    setIsUpdatingPro(proId);
    if (isLinked) {
      // Remove link
      await supabase.from("professional_services").delete().match({
        professional_id: proId,
        service_id: serviceId
      });
    } else {
      // Add link
      await supabase.from("professional_services").insert({
        professional_id: proId,
        service_id: serviceId
      });
    }
    await fetchData();
    setIsUpdatingPro(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Adicionar Novo Profissional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                placeholder="Ex: João Silva" 
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Especialidade (Opcional)</label>
              <Input 
                value={newSpecialty} 
                onChange={(e) => setNewSpecialty(e.target.value)} 
                placeholder="Ex: Tosa e Banho" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Serviços que realiza:</label>
            <div className="flex flex-wrap gap-2">
              {services.map(service => (
                <Button
                  key={service.id}
                  variant={selectedServices.includes(service.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (selectedServices.includes(service.id)) {
                      setSelectedServices(selectedServices.filter(id => id !== service.id));
                    } else {
                      setSelectedServices([...selectedServices, service.id]);
                    }
                  }}
                  className="rounded-full"
                >
                  {service.title}
                </Button>
              ))}
            </div>
          </div>

          <Button className="w-full" onClick={addProfessional} disabled={adding || !newName}>
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            {adding ? "Adicionando..." : "Adicionar Profissional"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin mx-auto col-span-full" />
        ) : professionals.length === 0 ? (
          <p className="text-muted-foreground text-center col-span-full py-8">
            Nenhum profissional cadastrado.
          </p>
        ) : (
          professionals.map((pro) => (
            <Card key={pro.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{pro.name}</h4>
                      <p className="text-sm text-muted-foreground">{pro.specialty || "Geral"}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteProfessional(pro.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Habilitado para:</p>
                  <div className="flex flex-wrap gap-1">
                    {services.map(service => {
                      const isLinked = pro.services?.includes(service.id);
                      return (
                        <Button
                          key={service.id}
                          variant={isLinked ? "default" : "outline"}
                          size="sm"
                          disabled={isUpdatingPro === pro.id}
                          onClick={() => toggleService(pro.id, service.id, !!isLinked)}
                          className="text-[10px] h-6 px-2 rounded-full"
                        >
                          {service.title}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
