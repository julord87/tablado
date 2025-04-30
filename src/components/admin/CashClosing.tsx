"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { closeCashForDay, deleteDayCashClosure } from "@/actions/accountingActions";

type Props = {
  date: Date;
  isCashClosed: boolean;
  setIsCashClosed: (val: boolean) => void;
  onCloseSuccess?: () => void;
};

export function CloseDayCashButton({ date, isCashClosed, setIsCashClosed, onCloseSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const handleCloseCash = async () => {
    setLoading(true);
    const total = await closeCashForDay(date); // tu acción server
    setLoading(false);
    if (total !== null) {
      toast.success(`💸 Caja del día cerrada por $${total}!`);
      setIsCashClosed(true);
      onCloseSuccess?.();
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
    <Button onClick={handleDeleteClosure} variant="destructive" disabled={loading}>
      💵 Reabrir caja
    </Button>
  ) : (
    <Button onClick={handleCloseCash} disabled={loading} variant={"secondary"}>
      💵 Cerrar caja del día
    </Button>
  );
}
