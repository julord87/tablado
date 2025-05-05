"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CloseDayCashButton } from "./CashClosing";

export default function CashClosureCard() {
  const [isCashClosed, setIsCashClosed] = useState(false);

  // Opcional: podrías traer el estado real desde la DB con una action acá
  // useEffect(() => { ... }, []);

  const today = new Date();

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
