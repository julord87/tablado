import { closeCashForDay } from "@/actions/accountingActions";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const total = await closeCashForDay(new Date());

    if (total === null) {
      return NextResponse.json(
        { message: "No hubo shows hoy. No se cerró nada." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Cierre exitoso", total },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error en el cierre de caja" },
      { status: 500 }
    );
  }
}
