"use client";

import { useEffect, useState } from "react";
import { getShows } from "@/actions/showActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ShowFormModal from "@/components/admin/ShowFormModal";

export default function AdminShowsPage() {
  const [shows, setShows] = useState<any[]>([]);
  const [selectedShow, setSelectedShow] = useState<any | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [open, setOpen] = useState(false);

  const fetchShows = async () => {
    const data = await getShows();
    const withTicketsSold = data.map((show) => {
      const ticketsSold = (show.Reservation ?? []).reduce(
        (total, res) =>
          total + res.items.reduce((sum, item) => sum + item.quantity, 0),
        0
      );
      return { ...show, ticketsSold };
    });
    setShows(withTicketsSold);
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleOpenCreate = () => {
    setMode("create");
    setSelectedShow(null);
    setOpen(true);
  };

  const handleOpenEdit = (show: any) => {
    setMode("edit");
    setSelectedShow(show);
    setOpen(true);
  };

  const handleSuccess = () => {
    setOpen(false);
    fetchShows();
    toast.success(mode === "create" ? "Show creado!" : "Show actualizado!");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shows</h1>
        <Button onClick={handleOpenCreate} className="font-sans">Crear Show</Button>
      </div>

      {shows.length === 0 ? (
        <p>No hay shows programados.</p>
      ) : (
        <table className="w-full border font-sans">
          <thead>
            <tr className="bg-gray-100 text-lg">
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Hora</th>
              <th className="p-2 border">Capacidad</th>
              <th className="p-2 border">Tickets vendidos</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show) => (
              <tr key={show.id} className="text-center">
                <td className="border p-2">{new Date(show.date).toLocaleDateString("es-ES")}</td>
                <td className="border p-2">{show.time}</td>
                <td className="border p-2">{show.capacity}</td>
                <td className="border p-2">{show.ticketsSold}</td>
                <td className="border p-2 space-x-2">
                  <Button variant="secondary" onClick={() => handleOpenEdit(show)}>
                    Editar
                  </Button>
                  {/* Acá podés dejar el DeleteShowButton como está */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ShowFormModal
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        show={selectedShow}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
