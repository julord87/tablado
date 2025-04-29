'use server'

import { prisma } from "../../prisma/lib";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  const users = await prisma.user.findMany({});
  return users;
}

export async function createUser(formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  
  if (!name || !email || !password) throw new Error("Datos incompletos");
  
  await prisma.user.create({ data: { name, email, password } });

  revalidatePath("/admin/users");
}

export async function deleteUser(id: number) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
