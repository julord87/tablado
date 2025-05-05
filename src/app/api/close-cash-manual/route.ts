import { NextRequest, NextResponse } from "next/server";
import { closeCashForDay } from "@/actions/accountingActions";
import { auth } from "../../../../auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id) : undefined;

    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { date } = await req.json();

    const total = await closeCashForDay(new Date(date), userId);

    if (total === null) {
      return NextResponse.json({ message: "No hubo shows ese día" }, { status: 200 });
    }

    return NextResponse.json({ total }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error en cierre manual" }, { status: 500 });
  }
}
