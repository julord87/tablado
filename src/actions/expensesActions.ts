"use server";

import { ExpenseCategory } from "@prisma/client";
import { prisma } from "../../prisma/lib";
import { revalidatePath } from "next/cache";
import { auth } from "../../auth";

// Obtener todos los egresos de un mes y año
export async function getExpensesByMonth(month: number, year: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    include: {
      user: true, // 👈 Esto incluye el nombre del usuario (si hay)
    },
    orderBy: {
      date: "desc",
    },
  });

  return expenses;
}

// Crear un egreso
export async function createExpense(data: {
  amount: number;
  category: string;
  description?: string;
  date: string;
}) {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : undefined;

  await prisma.expense.create({
    data: {
      amount: data.amount,
      category: data.category as ExpenseCategory,
      description: data.description,
      date: new Date(),
      userId: userId
    },
  });

  revalidatePath("/admin/accounting/expense");
}


// Editar un egreso
export async function updateExpense(
  id: number,
  data: {
    amount: number;
    category: string;
    description?: string;
    date: string;
  }
) {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : undefined;

  await prisma.expense.update({
    where: { id },
    data: {
      amount: data.amount,
      category: data.category as ExpenseCategory,
      description: data.description,
      date: new Date(),
      userId: userId, 
    },
  });

  revalidatePath("/admin/accounting/expense");
}

export async function getExpenseTotals(
  fecha: Date | null,
  month?: number,
  year?: number
) {
  if (fecha) {
    const startOfDay = new Date(fecha);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(fecha);
    endOfDay.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(fecha);
    startOfWeek.setDate(startOfWeek.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const endOfMonth = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

    const startOfYear = new Date(fecha.getFullYear(), 0, 1);
    const endOfYear = new Date(fecha.getFullYear(), 11, 31);

    const [totalDia, totalSemana, totalMes, totalAnual] = await Promise.all([
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: {
          date: { gte: startOfDay, lte: endOfDay },
        },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: {
          date: { gte: startOfWeek, lte: endOfDay },
        },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: {
          date: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: {
          date: { gte: startOfYear, lte: endOfYear },
        },
      }),
    ]);

    return {
      totalDia: totalDia._sum.amount || 0,
      totalSemana: totalSemana._sum.amount || 0,
      totalMes: totalMes._sum.amount || 0,
      totalAnual: totalAnual._sum.amount || 0,
    };
  }

  // Si no hay fecha (selectedDay es null), calculá solo el total del mes y del año
  const startOfMonth = new Date(year!, month! - 1, 1);
  const endOfMonth = new Date(year!, month!, 0);
  const startOfYear = new Date(year!, 0, 1);
  const endOfYear = new Date(year!, 11, 31);

  const [totalMes, totalAnual] = await Promise.all([
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        date: { gte: startOfMonth, lte: endOfMonth },
      },
    }),
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        date: { gte: startOfYear, lte: endOfYear },
      },
    }),
  ]);

  return {
    totalDia: 0,
    totalSemana: 0,
    totalMes: totalMes._sum.amount || 0,
    totalAnual: totalAnual._sum.amount || 0,
  };
}

export async function getExpenseTotalsByType(year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59);

  const expenses = await prisma.expense.groupBy({
    by: ["category"],
    _sum: {
      amount: true,
    },
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
  });

  return expenses.map((expense) => ({
    type: expense.category,
    amount: expense._sum.amount || 0,
  }));
}

// En expensesActions.ts
export async function getLastExpenses(limit = 5) {
  return prisma.expense.findMany({
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

// Eliminar un egreso
export async function deleteExpense(id: number) {
  await prisma.expense.delete({
    where: { id },
  });

  revalidatePath("/admin/accounting/expense");
}
