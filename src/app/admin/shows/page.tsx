"use client";

import { useEffect, useState } from "react";
import { getShows, getHistoricShows } from "@/actions/showActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ShowFormModal from "@/components/admin/ShowFormModal";
import { DeleteShowButton } from "@/components/admin/DeleteShowButton";
import Link from "next/link";

export default function AdminShowsPage() {
  const [shows, setShows] = useState<any[]>([]);
  const [selectedShow, setSelectedShow] = useState<any | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [open, setOpen] = useState(false);
  const [showHistoric, setShowHistoric] = useState(false);

  const fetchShows = async () => {
    const data = showHistoric ? await getHistoricShows() : await getShows();
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
  }, [showHistoric]);

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
        <h1 className="text-3xl font-bold">
          {showHistoric ? "Historial de Shows" : "Próximos Shows"}
        </h1>
        <div className="flex gap-2">
          <Button onClick={handleOpenCreate} className="font-sans">
            Crear Show
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowHistoric((prev) => !prev);
            }}
          >
            {showHistoric ? "Ver próximos" : "Ver histórico"}
          </Button>
        </div>
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
                <td className="border p-2">
                  {new Date(show.date).toLocaleDateString("es-ES")}
                </td>
                <td className="border p-2">{show.time}</td>
                <td className="border p-2">{show.capacity}</td>
                <td className="border p-2">{show.ticketsSold}</td>
                <td className="border p-2 space-x-2">
                  <Link
                    href={`/admin/shows/${show.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded"
                  >
                    Ver Detalles
                  </Link>
                  {/* Cambié el texto del botón a "Ver Detalles" */}
                  <Button
                    variant="secondary"
                    className="hover:bg-gray-200 text-sm py-2 px-4 rounded"
                    onClick={() => handleOpenEdit(show)}
                  >
                    Editar
                  </Button>
                  <DeleteShowButton id={show.id} onDelete={fetchShows} />
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
