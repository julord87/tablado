"use client";

import { deleteTicketType } from "@/actions/ticketTypeActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteTicketButton({ id }: { id: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("¿Seguro que querés eliminar esta entrada?")) {
      return;
    }

    await deleteTicketType(id);

    toast.success("Entrada eliminada exitosamente"); // Mostramos el toast

    router.refresh(); // Actualizamos la lista sin reload feo
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-sans"
    >
      Borrar
    </button>
  );
}
