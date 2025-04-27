"use server";

import { prisma } from "../../prisma/lib/prisma";

export async function getTicketTypes() {
  const ticketTypes = await prisma.ticketType.findMany({
    orderBy: { price: "asc" },
  });

  return ticketTypes;
}

export async function createTicketType(data: {
  name: string;
  description: string;
  price: number;
}) {
  await prisma.ticketType.create({
    data,
  });
}
