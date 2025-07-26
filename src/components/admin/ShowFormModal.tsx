"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createShow, updateShow } from "@/actions/showActions";

interface ShowFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  show: any | null;
  onSuccess: () => void;
}

export default function ShowFormModal({
  open,
  onOpenChange,
  mode,
  show,
  onSuccess,
}: ShowFormModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [capacity, setCapacity] = useState(40);

  useEffect(() => {
    if (show && mode === "edit") {
      setDate(new Date(show.date).toISOString().split("T")[0]);
      setTime(show.time);
      setCapacity(show.capacity);
    } else {
      setDate("");
      setTime("18:00");
      setCapacity(30);
    }
  }, [show, mode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "create") {
        await createShow({ date, time, capacity });
      } else {
        await updateShow({ id: show.id, date, time, capacity });
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{mode === "create" ? "Crear Show" : "Editar Show"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label>Fecha</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div>
            <Label>Horario</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>

          <div>
            <Label>Capacidad</Label>
            <Input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              required
              min={1}
            />
          </div>

          <Button type="submit" className="w-full font-sans">
            {mode === "create" ? "Crear Show" : "Guardar Cambios"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
