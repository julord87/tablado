// src/app/admin/shows/new/page.tsx

"use client";

import { createShow } from "@/actions/showActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export default function CreateShowPage() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [capacity, setCapacity] = useState(40);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createShow({
      date,
      time: time as "SIX_PM" | "SEVEN_THIRTY" | "NINE_PM",
      capacity,
    });

    toast.success("✅ Show creado exitosamente!");

    setTimeout(() => {
      router.push("/admin/shows");
    }, 1500);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Crear nuevo Show</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Horario</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Capacidad</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="border p-2 rounded w-full"
            required
            min={1}
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Crear
        </button>
      </form>
    </div>
  );
}
