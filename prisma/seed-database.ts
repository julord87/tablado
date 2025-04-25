import { initialData } from "./seed";
import prisma from "./lib/prisma";

async function main() {

    // Borrar las tablas
    await prisma.ticketType.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.user.deleteMany();
    await prisma.reservation.deleteMany();
    await prisma.show.deleteMany();

    // Insertar los datos iniciales
    await prisma.ticketType.createMany({
        data: initialData.ticketTypes,
    });
    await prisma.user.createMany({
        data: initialData.users || [],
    });


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