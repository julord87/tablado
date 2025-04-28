// src/app/admin/shows/[id]/edit/page.tsx

"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateShow, getShowById } from "@/actions/showActions";

interface EditShowPageProps {
  params: Promise<{ id: string }>;
}

export default function EditShowPage({ params }: EditShowPageProps) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const { id } = use(params);
  const numericId = Number(id);

  useEffect(() => {
    async function fetchShow() {
      try {
        const show = await getShowById(numericId);

        if (!show) {
          toast.error("Show no encontrado");
          router.push("/admin/shows");
          return;
        }

        setDate(new Date(show.date).toISOString().split("T")[0]);
        setTime(show.time);
        setCapacity(show.capacity);
      } catch (error) {
        console.error(error);
        toast.error("Error cargando show");
        router.push("/admin/shows");
      } finally {
        setLoading(false);
      }
    }

    fetchShow();
  }, [numericId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateShow({
      id: numericId,
      date,
      time,
      capacity,
    });

    toast.success("✅ Show actualizado exitosamente!");

    setTimeout(() => {
      router.push("/admin/shows");
    }, 1500);
  };

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Editar Show</h1>

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
            type="text"
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-sans"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
