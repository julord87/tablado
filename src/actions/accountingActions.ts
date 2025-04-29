"use server";

import { prisma } from "../../prisma/lib/prisma";

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

export async function createIncome(data: {
  amount: number;
  source: string;
  date: string;
}) {
  const { amount, source, date } = data;
  await prisma.income.create({
    data: {
      amount,
      source,
      date: new Date(date),
    },
  });
}

export async function updateIncome(
  id: number,
  data: { amount: number; source: string; date: string }
) {
  const { amount, source, date } = data;
  await prisma.income.update({
    where: { id },
    data: {
      amount,
      source,
      date: new Date(date),
    },
  });
}

export async function deleteIncome(id: number) {
  await prisma.income.delete({
    where: { id },
  });
}
