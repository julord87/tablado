"use client";

import { closeCashForDay } from "@/actions/accountingActions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// CloseDayCashButton.tsx
export function CloseDayCashButton({
  date,
  onCloseSuccess,
}: {
  date: Date;
  onCloseSuccess?: () => void;
}) {
  const router = useRouter();

  const handleClick = async () => {
    try {
      const total = await closeCashForDay(date);
      if (total !== null && total !== undefined) {
        toast.success(`Cierre de caja del día registrado: $${total.toFixed(2)}`);
        onCloseSuccess?.(); // <--- gatillamos el refresh desde IncomePage
      } else {
        toast.error("Error: el total es nulo o indefinido");
      }
      router.refresh(); // opcional si querés forzar navegación
    } catch (error: any) {
      toast.error(error.message || "Error al cerrar la caja del día");
    }
  };

  return (
    <Button variant="outline" onClick={handleClick}>
      💵 Cerrar caja del día
    </Button>
  );
}
