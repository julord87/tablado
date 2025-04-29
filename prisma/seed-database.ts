import { initialData } from "./seed";
import { prisma } from "./lib";
import bcrypt from "bcryptjs";

async function main() {
  // Borrar las tablas
  await prisma.user.deleteMany();
  await prisma.reservationItem.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.show.deleteMany();

  // Insertar los datos iniciales

  // Insertar los tipos de tickets
  await prisma.ticketType.createMany({
    data: initialData.ticketTypes,
  });

  // Insertar los usuarios
  const runSeed = async () => {
    await prisma.user.createMany({
      data: [
        {
          name: "Julián",
          email: "julianmgtb@gmail.com",
          password: await bcrypt.hash("0831", 10),
        },
        {
          name: "Valeria",
          email: "valemar1970@gmil.com",
          password: await bcrypt.hash("1970", 10),
        },
      ],
    });
  };

  runSeed();

  console.log("Seed database ejecutado correctamente");
}


// Ejecutar el seed solo en desarrollo
// y no en producción

(() => {
  // if (process.env.NODE_ENV !== "production") {
  //     console.log("No se puede ejecutar el seed en producción");
  //     return;
  // }

  main();
})();
