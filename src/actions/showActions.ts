"use server";

import { prisma } from "../../prisma/lib/prisma";
import { revalidatePath } from "next/cache";

interface ShowInput {
  date: string;
  time: string;
  capacity: number;
}

interface UpdateShowInput {
  id: number;
  date: string;
  time: string;
  capacity: number;
}

export async function getHistoricShows() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ponemos la hora a 00:00 para comparar solo por fecha

  return await prisma.show.findMany({
    where: {
      date: {
        lt: today, // "less than" = shows pasados
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}

export async function getShows() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ponemos la hora a 00:00 para comparar solo por fecha

  return await prisma.show.findMany({
    where: {
      date: {
        gte: today, // "greater than or equal" = shows hoy o más adelante
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}

export async function getShowById(id: number) {
  return await prisma.show.findUnique({
    where: { id },
  });
}


export async function createShow({ date, time, capacity }: ShowInput) {
  if (!date || !time || !capacity) {
    throw new Error("Todos los campos son obligatorios");
  }

  await prisma.show.create({
    data: {
      date: new Date(date),
      time: time,
      capacity: capacity, // <- así directo
    },
  });

  revalidatePath("/admin/shows");
}

export async function updateShow({ id, date, time, capacity }: UpdateShowInput) {
  if (!date || !time || !capacity) {
    throw new Error("Todos los campos son obligatorios");
  }

  await prisma.show.update({
    where: { id },
    data: {
      date: new Date(date),
      time: time,
      capacity: parseInt(String(capacity)),
    },
  });

  revalidatePath("/admin/shows");
}

export async function deleteShow(id: number) {
  await prisma.show.delete({
    where: { id },
  });

  revalidatePath("/admin/shows");
}

