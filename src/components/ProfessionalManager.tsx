import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, User } from "lucide-react";

interface Professional {
  id: string;
  name: string;
  specialty: string | null;
  is_active: boolean;
}

export const ProfessionalManager = ({ profileId }: { profileId: string }) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("");

  useEffect(() => {
    fetchProfessionals();
  }, [profileId]);

  const fetchProfessionals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("professionals")
      .select("*")
      .eq("profile_id", profileId);

    if (error) {
      toast.error("Erro ao carregar profissionais");
    } else {
      setProfessionals(data || []);
    }
    setLoading(false);
  };

  const addProfessional = async () => {
    if (!newName) return;
    setAdding(true);
    const { error } = await supabase.from("professionals").insert({
      profile_id: profileId,
      name: newName,
      specialty: newSpecialty,
    });

    if (error) {
      toast.error("Erro ao adicionar profissional");
    } else {
      toast.success("Profissional adicionado!");
      setNewName("");
      setNewSpecialty("");
      fetchProfessionals();
    }
    setAdding(false);
  };

  const deleteProfessional = async (id: string) => {
    const { error } = await supabase.from("professionals").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao remover profissional");
    } else {
      toast.success("Profissional removido");
      fetchProfessionals();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Adicionar Novo Profissional</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 items-end">
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
          <Button onClick={addProfessional} disabled={adding || !newName}>
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            {adding ? "Adicionando..." : "Adicionar"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin mx-auto col-span-full" />
        ) : professionals.length === 0 ? (
          <p className="text-muted-foreground text-center col-span-full py-8">
            Nenhum profissional cadastrado.
          </p>
        ) : (
          professionals.map((pro) => (
            <Card key={pro.id}>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
