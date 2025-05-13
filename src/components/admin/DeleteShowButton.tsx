"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteShow } from "@/actions/showActions";

export function DeleteShowButton({
  id,
  onDelete,
}: {
  id: number;
  onDelete?: () => void;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("¿Seguro que querés eliminar este show?")) return;

    await deleteShow(id);
    toast.success("✅ Show eliminado");

    onDelete?.(); // ejecuta la función que le pasaste
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
    >
      Borrar
    </button>
  );
}
