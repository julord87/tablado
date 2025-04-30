import { NextResponse } from "next/server";
import { isCashClosedForToday } from "@/actions/accountingActions";

export async function GET() {
  const closed = await isCashClosedForToday();
  return NextResponse.json({ closed });
}