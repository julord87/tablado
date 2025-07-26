"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CloseDayCashButton } from "./CashClosing";

export default function CashClosureCard() {
  const [isCashClosed, setIsCashClosed] = useState<boolean | null>(null);

  const today = new Date();

  useEffect(() => {
    const checkCashStatus = async () => {
      try {
        const res = await fetch("/api/is-cash-closed");
        const data = await res.json();
        setIsCashClosed(data.closed);
      } catch (err) {
        console.error("Error al consultar estado de caja:", err);
      }
    };

    checkCashStatus();
  }, []);

  // Evita render hasta saber si está cerrada
  if (isCashClosed === null) return null;

  return (
    <Card className="bg-stone-50 lg:col-span-4 font-sans">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground font-sans">Cierre de caja de hoy</p>
            <p className="text-lg font-bold">
              {isCashClosed ? "Cerrada" : "Pendiente"}
            </p>
          </div>
          <CloseDayCashButton
            date={today}
            isCashClosed={isCashClosed}
            setIsCashClosed={setIsCashClosed}
          />
        </div>
      </CardContent>
    </Card>
  );
}
