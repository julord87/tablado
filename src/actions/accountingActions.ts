"use server";

import { prisma } from "../../prisma/lib/prisma";
import { IncomeType, PaymentMethod } from "@prisma/client";
import { getExpenseTotals } from "./expensesActions";
import { auth } from "../../auth";

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
    include: {
      user: true,
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
  const session = await auth();
  const userId = session?.user?.id;
  const { amount, date, type, description, paymentMethod } = data;

  await prisma.income.create({
    data: {
      amount,
      date: new Date(),
      type,
      description,
      paymentMethod,
      userId: userId ? Number(userId) : null, // Asegúrate de que userId sea un número
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
    data: {
      ...data,
      date: new Date(), // Asegúrate de que la fecha sea un objeto Date
    },
  });
}

export async function closeCashForDay(
  date: Date,
  userId?: number
): Promise<number | null> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Shows del día (con reservas)
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

  const allItems = shows.flatMap((show) =>
    show.Reservation.flatMap((res) => res.items)
  );

  const ticketsSold = allItems.reduce((sum, i) => sum + i.quantity, 0);
  const ticketsSoldAmount = allItems.reduce(
    (sum, i) => sum + i.type.price * i.quantity,
    0
  );

  // Todos los ingresos del día
  const allIncomes = await prisma.income.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const totalIncomeToday = allIncomes.reduce((sum, i) => sum + i.amount, 0);

  // Ingresos solo web
  const incomesWeb = allIncomes.filter((i) => i.type === "tickets_web");
  const totalTicketsWeb = incomesWeb.reduce((sum, i) => sum + i.amount, 0);
  const ticketsSoldWeb = incomesWeb.length;

  // Egresos del día
  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const totalExpensesToday = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Si no hubo nada: no se cierra la caja
  if (shows.length === 0 && allIncomes.length === 0 && expenses.length === 0) {
    return null;
  }

  // Crear ingreso automático si hubo ventas pero no hay registro web
  if (ticketsSoldAmount > 0 && totalTicketsWeb === 0) {
    await prisma.income.create({
      data: {
        date: new Date(),
        amount: ticketsSoldAmount,
        type: "tickets_web",
        description: "Ingreso por venta de entradas web",
        paymentMethod: "varios",
        userId: userId ?? null,
      },
    });
  }

  // Cierre de caja
  const closure = await prisma.cashClosure.create({
    data: {
      date: startOfDay,
      total: totalIncomeToday - totalExpensesToday,
      ticketsSoldAmount,
      ticketsSold,
      ticketsSoldWeb,
      userId,
      shows: {
        connect: shows.map((s) => ({ id: s.id })),
      },
      tickets: {
        connect: allItems.map((item) => ({ id: item.id })),
      },
    },
  });

  return closure.total;
}

export async function isCashClosedForToday(): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const closure = await prisma.cashClosure.findFirst({
    where: {
      date: today,
    },
  });

  return !!closure;
}

export async function deleteDayCashClosure(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const closure = await prisma.cashClosure.findFirst({
    where: {
      date: startOfDay,
    },
  });

  if (closure) {
    await prisma.cashClosure.delete({
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
  from.setHours(0, 0, 0, 0);

  const incomes = await prisma.income.findMany({
    where: {
      date: { gte: from },
    },
  });

  const map = new Map<string, number>();

  for (const i of incomes) {
    const key = i.date.toISOString().split("T")[0]; // YYYY-MM-DD
    const existing = map.get(key) || 0;
    map.set(key, existing + i.amount);
  }

  const total = Array.from(map.values()).reduce((sum, val) => sum + val, 0);
  const average = map.size > 0 ? total / map.size : 0;
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
