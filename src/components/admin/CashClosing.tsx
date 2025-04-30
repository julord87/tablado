"use client";

import { closeCashForDay } from "@/actions/accountingActions";
import { isCashClosedForToday } from "@/actions/accountingActions";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// CloseDayCashButton.tsx
export function CloseDayCashButton({ date, onCloseSuccess }: { date: Date; onCloseSuccess?: () => void }) {
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    (async () => {
      const closed = await isCashClosedForToday();
      setIsDisabled(closed);
    })();
  }, []);
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
    <Button variant="outline" onClick={handleClick} disabled={isDisabled}>
      💵 Cerrar caja del día
    </Button>
  );
}
