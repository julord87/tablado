"use server";

import { ExpenseCategory } from "@prisma/client";
import { prisma } from "../../prisma/lib";
import { revalidatePath } from "next/cache";

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
  await prisma.expense.create({
    data: {
      amount: data.amount,
      category: data.category as ExpenseCategory,
      description: data.description,
      date: new Date(data.date),
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
  await prisma.expense.update({
    where: { id },
    data: {
      amount: data.amount,
      category: data.category as ExpenseCategory,
      description: data.description,
      date: new Date(data.date),
    },
  });

  revalidatePath("/admin/accounting/expense");
}

export async function getExpenseTotals(date: Date = new Date()) {
    const base = new Date(date);
  
    const startOfDay = new Date(base);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(base);
    endOfDay.setHours(23, 59, 59, 999);
  
    const startOfWeek = new Date(base);
    startOfWeek.setDate(base.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);
  
    const startOfMonth = new Date(base.getFullYear(), base.getMonth(), 1);
    const endOfMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
  
    const startOfYear = new Date(base.getFullYear(), 0, 1);
    const endOfYear = new Date(base.getFullYear(), 11, 31);
    endOfYear.setHours(23, 59, 59, 999);
  
    const [totalDia, totalSemana, totalMes, totalAnual] = await Promise.all([
      prisma.expense.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      prisma.expense.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          date: {
            gte: startOfWeek,
            lte: endOfDay,
          },
        },
      }),
      prisma.expense.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),
      prisma.expense.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          date: {
            gte: startOfYear,
            lte: endOfYear,
          },
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
  

// Eliminar un egreso
export async function deleteExpense(id: number) {
  await prisma.expense.delete({
    where: { id },
  });

  revalidatePath("/admin/accounting/expense");
}
