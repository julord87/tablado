"use client";

import { deleteTicketType } from "@/actions/ticketTypeActions";

export function DeleteTicketButton({ id }: { id: number }) {
  const handleDelete = async () => {
    if (!confirm("¿Seguro que querés eliminar esta entrada?")) {
      return;
    }
    await deleteTicketType(id);

    window.location.reload();
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
