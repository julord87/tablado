"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  closeCashForDay,
  deleteDayCashClosure,
} from "@/actions/accountingActions";
import { useSession } from "next-auth/react"; // 👈 nuevo

type Props = {
  date: Date;
  isCashClosed: boolean;
  setIsCashClosed: (val: boolean) => void;
  onCloseSuccess?: () => void;
};

export function CloseDayCashButton({
  date,
  isCashClosed,
  setIsCashClosed,
  onCloseSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession(); // 👈 obtenés la sesión

  const handleCloseCash = async () => {
    setLoading(true);

    const res = await fetch("/api/close-cash-manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok && typeof data.total === "number") {
      toast.success(`💸 Caja del día cerrada por $${data.total}!`);
      setIsCashClosed(true);
      onCloseSuccess?.();
    } else {
      toast.error(data.message || "Error al cerrar caja");
    }
  };

  const handleDeleteClosure = async () => {
    setLoading(true);
    await deleteDayCashClosure(date);
    setLoading(false);
    toast.success("❌ Cierre eliminado!");
    setIsCashClosed(false);
    onCloseSuccess?.();
  };

  return isCashClosed ? (
    <Button
      onClick={handleDeleteClosure}
      variant="destructive"
      disabled={loading}
    >
      💵 Reabrir caja
    </Button>
  ) : (
    <Button onClick={handleCloseCash} disabled={loading} variant={"secondary"}>
      💵 Cerrar caja del día
    </Button>
  );
}
