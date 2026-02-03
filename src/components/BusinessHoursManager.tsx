import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const DAYS = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", 
  "Quinta-feira", "Sexta-feira", "Sábado"
];

interface BusinessHour {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export const BusinessHoursManager = ({ profileId }: { profileId: string }) => {
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHours();
  }, [profileId]);

  const fetchHours = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("business_hours")
      .select("*")
      .eq("profile_id", profileId)
      .order("day_of_week", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar horários");
    } else {
      // Initialize with default values if empty
      if (!data || data.length === 0) {
        const defaults = DAYS.map((_, i) => ({
          day_of_week: i,
          open_time: "08:00",
          close_time: "18:00",
          is_closed: i === 0 // Sunday closed by default
        }));
        setHours(defaults);
      } else {
        setHours(data);
      }
    }
    setLoading(false);
  };

  const saveHours = async () => {
    setSaving(true);
    
    // Using upsert would be better if we have IDs, but for simplicity let's delete and insert
    // Or better, just upsert by constraints if possible
    const { error } = await supabase.from("business_hours").upsert(
      hours.map(h => ({ ...h, profile_id: profileId })),
      { onConflict: 'profile_id,day_of_week' }
    );

    if (error) {
      console.error(error);
      toast.error("Erro ao salvar horários");
    } else {
      toast.success("Horários salvos com sucesso!");
    }
    setSaving(false);
  };

  const updateHour = (index: number, field: keyof BusinessHour, value: any) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], [field]: value };
    setHours(newHours);
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Horário de Funcionamento</CardTitle>
        <Button onClick={saveHours} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar Alterações
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {hours.map((h, i) => (
          <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0">
            <div className="w-32 font-medium">{DAYS[h.day_of_week]}</div>
            <div className="flex-1 flex items-center gap-4">
              <Input 
                type="time" 
                value={h.open_time} 
                className="w-32" 
                disabled={h.is_closed}
                onChange={(e) => updateHour(i, 'open_time', e.target.value)}
              />
              <span className="text-muted-foreground">até</span>
              <Input 
                type="time" 
                value={h.close_time} 
                className="w-32" 
                disabled={h.is_closed}
                onChange={(e) => updateHour(i, 'close_time', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{h.is_closed ? "Fechado" : "Aberto"}</span>
              <Switch 
                checked={!h.is_closed} 
                onCheckedChange={(checked) => updateHour(i, 'is_closed', !checked)}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
