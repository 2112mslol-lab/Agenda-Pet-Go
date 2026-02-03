import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface TimeSlotPickerProps {
  date: Date | undefined;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  schedulingRules?: {
    min_advance_hours: number;
    max_days_advance: number;
    lock_day_before?: boolean;
  };
}

interface BookedSlot {
  time: string;
  clientName: string;
  service: string;
}

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

export const TimeSlotPicker = ({
  date,
  selectedTime,
  onTimeSelect,
  schedulingRules = { min_advance_hours: 2, max_days_advance: 30 }
}: TimeSlotPickerProps) => {
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!date) {
      setBookedSlots([]);
      return;
    }

    const fetchBookedSlots = async () => {
      setIsLoading(true);
      try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
          .from("agendamentos")
          .select("data_hora, nome_cliente, servico, status")
          .gte("data_hora", startOfDay.toISOString())
          .lte("data_hora", endOfDay.toISOString())
          .in("status", ["pendente", "confirmado"]);

        if (error) throw error;

        const booked: BookedSlot[] = (data || []).map((booking) => ({
          time: format(new Date(booking.data_hora), "HH:mm"),
          clientName: booking.nome_cliente,
          service: booking.servico,
        }));

        setBookedSlots(booked);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedSlots();

    // Set up real-time subscription
    const channel = supabase
      .channel("agendamentos-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "agendamentos",
        },
        () => {
          fetchBookedSlots();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [date]);

  const isSlotTooSoon = (slot: string) => {
    if (!date) return false;
    
    const now = new Date();
    const [hours, minutes] = slot.split(":").map(Number);
    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);

    const minAdvanceMs = schedulingRules.min_advance_hours * 60 * 60 * 1000;
    return slotDate.getTime() < now.getTime() + minAdvanceMs;
  };

  const isSlotBooked = (slot: string) => {
    return bookedSlots.some((booked) => booked.time === slot);
  };

  const getBookedSlotInfo = (slot: string) => {
    return bookedSlots.find((booked) => booked.time === slot);
  };

  const availableCount = timeSlots.filter((slot) => !isSlotBooked(slot)).length;

  if (!date) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Selecione uma data para ver os horários disponíveis</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 p-3 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-foreground">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <span className="text-sm text-foreground">Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-foreground">Selecionado</span>
        </div>
      </div>

      {/* Availability Counter */}
      <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
        <p className="text-sm font-medium text-foreground">
          {isLoading ? (
            "Carregando horários..."
          ) : (
            <>
              <span className="text-2xl font-bold text-primary">
                {availableCount}
              </span>{" "}
              {availableCount === 1 ? "horário disponível" : "horários disponíveis"}
            </>
          )}
        </p>
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        <TooltipProvider>
          {timeSlots.map((slot) => {
            const isBooked = isSlotBooked(slot);
            const isTooSoon = isSlotTooSoon(slot);
            const isDisabled = isBooked || isTooSoon;
            const bookedInfo = getBookedSlotInfo(slot);
            const isSelected = selectedTime === slot;

            const slotButton = (
              <button
                type="button"
                onClick={() => !isDisabled && onTimeSelect(slot)}
                disabled={isDisabled}
                className={cn(
                  "relative p-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm",
                  "hover:scale-105 active:scale-95",
                  isDisabled &&
                    "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-60",
                  !isDisabled &&
                    !isSelected &&
                    "bg-white border-green-200 text-foreground hover:border-green-400 hover:bg-green-50",
                  isSelected &&
                    "bg-blue-500 border-blue-600 text-white shadow-lg scale-105"
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>{slot}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 animate-scale-in" />
                  )}
                  {isBooked && <XCircle className="w-4 h-4" />}
                  {isTooSoon && !isBooked && <Clock className="w-3 h-3 opacity-50" />}
                </div>
              </button>
            );

            if (isDisabled) {
               return (
                <Tooltip key={slot}>
                  <TooltipTrigger asChild>{slotButton}</TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">
                        {isBooked ? "Já reservado" : `Aviso mínimo de ${schedulingRules.min_advance_hours}h necessário`}
                    </p>
                  </TooltipContent>
                </Tooltip>
               );
            }

            return <div key={slot}>{slotButton}</div>;
          })}
        </TooltipProvider>
      </div>

      {isLoading && (
        <div className="text-center text-sm text-muted-foreground animate-pulse">
          Atualizando disponibilidade...
        </div>
      )}
    </div>
  );
};
