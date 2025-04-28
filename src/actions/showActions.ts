"use server";

import { prisma } from "../../prisma/lib/prisma";
import { revalidatePath } from "next/cache";

interface ShowInput {
  date: string;
  time: string;
  capacity: number;
}

export async function getShows() {
    return await prisma.show.findMany({
      orderBy: {
        date: "asc",
      },
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
