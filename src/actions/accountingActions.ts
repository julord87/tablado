"use server";

import { prisma } from "../../prisma/lib/prisma";
import { IncomeType, PaymentMethod } from "@prisma/client";
import { getExpenseTotals } from "./expensesActions";

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
const sevilleTime = new Date(
  now.toLocaleString("en-US", { timeZone: "Europe/Madrid" })
);

export async function createIncome(data: {
  amount: number;
  date: string;
  type: IncomeType;
  description?: string | null;
  paymentMethod: PaymentMethod | null;
}) {
  const { amount, date, type, description, paymentMethod } = data;
  const sevilleTime = new Date(date); // Si ya lo calculás afuera, mantenelo así

  await prisma.income.create({
    data: {
      amount,
      date: sevilleTime,
      type,
      description,
      paymentMethod,
    },
  });
}

export async function updateIncome(
  id: number,
  data: Partial<{
    amount: number;
    date: string;
    type: IncomeType;
    description: string | null;
    paymentMethod: PaymentMethod | null;
  }>
) {
  await prisma.income.update({
    where: { id },
    data,
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
      description: `Cierre de caja ventas web del ${formattedDate}`,
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
      type: "tickets_web",
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  return !!existingClosure;
}

export async function deleteDayCashClosure(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const closure = await prisma.income.findFirst({
    where: {
      type: "tickets_web",
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (closure) {
    await prisma.income.delete({
      where: { id: closure.id },
    });
  }
}

// accountingActions.ts
export async function getAccountingTotals(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const endOfYear = new Date(date.getFullYear(), 11, 31);

  const [incomeDay, incomeMonth, incomeYear] = await Promise.all([
    prisma.income.aggregate({
      _sum: { amount: true },
      where: { date: { gte: startOfDay, lte: endOfDay } },
    }),
    prisma.income.aggregate({
      _sum: { amount: true },
      where: { date: { gte: startOfMonth, lte: endOfMonth } },
    }),
    prisma.income.aggregate({
      _sum: { amount: true },
      where: { date: { gte: startOfYear, lte: endOfYear } },
    }),
  ]);

  const twelveMonthsAgo = new Date(date);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const [incomeLast12, expenseLast12] = await Promise.all([
    prisma.income.aggregate({
      _sum: { amount: true },
      where: { date: { gte: twelveMonthsAgo, lte: date } },
    }),
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: { date: { gte: twelveMonthsAgo, lte: date } },
    }),
  ]);

  const { totalDia, totalMes, totalAnual } = await getExpenseTotals(date);

  return {
    ingresosHoy: incomeDay._sum.amount || 0,
    egresosHoy: totalDia,
    balanceMes: (incomeMonth._sum.amount || 0) - totalMes,
    balanceAnual: (incomeYear._sum.amount || 0) - totalAnual,
    balance12Meses:
      (incomeLast12._sum.amount || 0) - (expenseLast12._sum.amount || 0),
  };
}

export async function getMonthlyIncomeVsExpenseLast12Months() {
  const now = new Date();
  const months = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  const monthlyData = await Promise.all(
    months.map(async ({ year, month }) => {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0, 23, 59, 59);

      const [incomes, expenses] = await Promise.all([
        prisma.income.aggregate({
          _sum: { amount: true },
          where: { date: { gte: start, lte: end } },
        }),
        prisma.expense.aggregate({
          _sum: { amount: true },
          where: { date: { gte: start, lte: end } },
        }),
      ]);

      return {
        month: month + 1,
        ingresos: incomes._sum.amount || 0,
        egresos: expenses._sum.amount || 0,
      };
    })
  );

  return monthlyData;
}

export async function getDailyIncomeVsExpenseLast30Days() {
  const now = new Date();
  const start = new Date();
  start.setDate(now.getDate() - 29); // incluye hoy

  const dailyData = await Promise.all(
    Array.from({ length: 30 }).map(async (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);

      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      const [incomes, expenses] = await Promise.all([
        prisma.income.aggregate({
          _sum: { amount: true },
          where: { date: { gte: dayStart, lte: dayEnd } },
        }),
        prisma.expense.aggregate({
          _sum: { amount: true },
          where: { date: { gte: dayStart, lte: dayEnd } },
        }),
      ]);

      return {
        day: day.toISOString().split("T")[0], // formato YYYY-MM-DD
        ingresos: incomes._sum.amount || 0,
        egresos: expenses._sum.amount || 0,
      };
    })
  );

  return dailyData;
}

export async function getIncomeTotalsByType(year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59);

  const result = await prisma.income.groupBy({
    by: ["type"],
    where: {
      date: { gte: start, lte: end },
    },
    _sum: { amount: true },
  });

  return result.map((r) => ({
    type: r.type ?? "Sin tipo",
    amount: r._sum.amount || 0,
  }));
}

export async function getIncomeByTicketType() {
  const items = await prisma.reservationItem.findMany({
    where: {
      reservation: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)), // últimos 30 días
        },
      },
    },
    include: {
      type: true,
      reservation: true, // 👈 Necesario para poder filtrar por fecha
    },
  });

  const incomeByType: Record<string, { amount: number; quantity: number }> = {};

  for (const i of items) {
    const typeName = i.type?.name || "Otro";
    const totalAmount = i.type?.price ? i.quantity * i.type.price : 0;

    if (!incomeByType[typeName]) {
      incomeByType[typeName] = { amount: 0, quantity: 0 };
    }

    incomeByType[typeName].amount += totalAmount;
    incomeByType[typeName].quantity += i.quantity;
  }

  return Object.entries(incomeByType).map(([type, data]) => ({
    type,
    amount: data.amount,
    quantity: data.quantity,
  }));
}

export async function getLastIncomes(limit = 5) {
  return prisma.income.findMany({
    take: limit,
    orderBy: { date: "desc" },
    select: {
      id: true,
      description: true,
      amount: true,
      date: true,
    },
  });
}

export async function getAverageDailyIncome() {
  const from = new Date();
  from.setDate(from.getDate() - 30);

  const daily = await prisma.income.groupBy({
    by: ["date"],
    where: {
      date: {
        gte: from,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const total = daily.reduce((acc, d) => acc + (d._sum.amount || 0), 0);
  const average = daily.length > 0 ? total / daily.length : 0;

  return { average };
}

export async function getIncomeByPaymentMethod() {
  const result = await prisma.income.groupBy({
    by: ["paymentMethod"],
    _sum: {
      amount: true,
    },
  });

  return result.map((item) => ({
    method: item.paymentMethod ?? "Sin especificar",
    total: item._sum.amount ?? 0,
  }));
}

export async function deleteIncome(id: number) {
  await prisma.income.delete({
    where: { id },
  });
}
