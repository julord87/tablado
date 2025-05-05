"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { closeCashForDay, deleteDayCashClosure } from "@/actions/accountingActions";
import { useSession } from "next-auth/react"; // 👈 nuevo

type Props = {
  date: Date;
  isCashClosed: boolean;
  setIsCashClosed: (val: boolean) => void;
  onCloseSuccess?: () => void;
};

export function CloseDayCashButton({ date, isCashClosed, setIsCashClosed, onCloseSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession(); // 👈 obtenés la sesión

  const handleCloseCash = async () => {
    setLoading(true);

    const userId = session?.user?.id ? parseInt(session.user.id) : undefined;

    const total = await closeCashForDay(date, userId); // 👈 ahora le pasás userId

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
