import { closeCashForDay, isCashClosedForToday } from "@/actions/accountingActions";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const alreadyClosed = await isCashClosedForToday();

    if (alreadyClosed) {
      return NextResponse.json(
        { message: "La caja ya fue cerrada manualmente. No se realizó cierre automático." },
        { status: 200 }
      );
    }

    const total = await closeCashForDay(new Date());

    if (total === null) {
      return NextResponse.json(
        { message: "No hubo shows hoy. No se cerró nada." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Cierre automático exitoso", total },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error en el cierre automático de caja" },
      { status: 500 }
    );
  }
}
