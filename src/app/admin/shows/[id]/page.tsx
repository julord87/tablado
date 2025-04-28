// src/app/admin/shows/[id]/page.tsx

import { getShowById } from "@/actions/showActions"; 
import { notFound } from "next/navigation";

export default async function ShowDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  if (isNaN(id)) {
    notFound();
  }

  const show = await getShowById(id);

  if (!show) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Detalle del Show</h1>
      <p className="mb-2"><strong>Fecha:</strong> {new Date(show.date).toLocaleDateString()}</p>
      <p className="mb-2"><strong>Horario:</strong> {show.time}</p>
      <p className="mb-2"><strong>Capacidad total:</strong> {show.capacity}</p>
      <p className="mb-2"><strong>Tickets vendidos:</strong> {show._count.tickets}</p>

      {/* Más adelante: listar los tickets */}
    </div>
  );
}
