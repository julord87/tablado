"use server";

import { prisma } from "../../prisma/lib/prisma";

export async function getTicketTypes() {
  const ticketTypes = await prisma.ticketType.findMany({
    orderBy: { price: "asc" },
  });

  return ticketTypes;
}

export async function createTicketType(data: { name: string; price: number; description: string }) {
  return await prisma.ticketType.create({
    data: {
      name: data.name,
      price: data.price,
      description: data.description,
    },
  });
}

export async function deleteTicketType(id: number) {
  await prisma.ticketType.delete({
    where: { id },
  });
}

export async function getTicketTypeById(id: number) {
  return prisma.ticketType.findUnique({
    where: { id },
  });
}

export async function updateTicketType(id: number, data: { name: string; description: string; price: number }) {
  await prisma.ticketType.update({
    where: { id },
    data,
  });
}
