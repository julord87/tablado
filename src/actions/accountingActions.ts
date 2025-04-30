"use server";

import { prisma } from "../../prisma/lib/prisma";
import { IncomeType } from "@prisma/client";

export async function getIncomesByMonth(month: number, year: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  return prisma.income.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { date: "desc" },
  });
}

export async function getIncomesByYear(year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 0, 23, 59, 59);

  return prisma.income.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { date: "desc" },
  });
}

const now = new Date();
const sevilleTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Madrid" }));

export async function createIncome(data: {
  amount: number;
  source: string;
  date: string;
  type: IncomeType;
}) {
  const { amount, source, date, type } = data;
  await prisma.income.create({
    data: {
      amount,
      source,
      date: sevilleTime,
      type,
    },
  });
}

export async function updateIncome(
  id: number,
  data: Partial<{
    amount: number;
    source: string;
    date: string;
    type: IncomeType;
  }>
) {
  const { amount, source, date, type } = data;
  await prisma.income.update({
    where: { id },
    data: {
      ...(amount && { amount }),
      ...(source && { source }),
      ...(date && { date: new Date(date) }),
      ...(type && { type }),
    },
  });
}

export async function closeCashForDay(date: Date): Promise<number | null> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const shows = await prisma.show.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      Reservation: {
        include: {
          items: { include: { type: true } },
        },
      },
    },
  });

  if (shows.length === 0) return null; // <-- No cerrar si no hay shows

  const total = shows
    .flatMap((show) =>
      show.Reservation.flatMap((r) =>
        r.items.map((i) => i.type.price * i.quantity)
      )
    )
    .reduce((a, b) => a + b, 0);

  const formattedDate = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(endOfDay);

  await prisma.income.create({
    data: {
      amount: total,
      type: "tickets_web",
      source: `Cierre de caja ventas web del ${formattedDate}`,
      date: new Date(),
    },
  });

  return total;
}

export async function isCashClosedForToday(): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingClosure = await prisma.income.findFirst({
    where: {
      type: 'tickets_web',
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  return !!existingClosure;
}


export async function deleteIncome(id: number) {
  await prisma.income.delete({
    where: { id },
  });
}
