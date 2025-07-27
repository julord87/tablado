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
import { Genre } from "../../../utils/types";

interface ShowFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  show: any | null;
  onSuccess: () => void;
}

const genreOptions = [
  "FLAMENCO",
  "TANGO",
  "MILONGA",
  "POP",
  "CANTAUTOR",
  "FOLCLORE",
  "OTRO",
];

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    if (show && mode === "edit") {
      setDate(new Date(show.date).toISOString().split("T")[0]);
      setTime(show.time);
      setCapacity(show.capacity);
      setTitle(show.title || "");
      setDescription(show.description || "");
      setGenre(show.genre || "");
    } else {
      setDate("");
      setTime("18:00");
      setCapacity(30);
      setTitle("");
      setDescription("");
      setGenre("");
    }
  }, [show, mode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      date,
      time,
      capacity,
      title,
      description,
      genre: genre ? (genre as Genre) : undefined,
    };

    try {
      if (mode === "create") {
        await createShow(payload);
      } else {
        await updateShow({ id: show.id, ...payload });
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
          <DialogTitle className="text-3xl">
            {mode === "create" ? "Crear Show" : "Editar Show"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Label>Título</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Descripción (opcional)</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200} // o 100 si querés algo más breve
              rows={4}
              className="w-full border rounded p-2 font-sans text-sm"
              placeholder="Escribe una breve descripción del show..."
            />
            <p className="text-sm text-muted-foreground text-right">
              {description.length}/200 caracteres
            </p>
          </div>

          <div>
            <Label>Género</Label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full border p-2 rounded font-sans text-sm"
            >
              <option value="">-- Selecciona un género --</option>
              {genreOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Fecha</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Horario</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
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
