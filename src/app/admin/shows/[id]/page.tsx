import { prisma } from "../../../../../prisma/lib";
import { notFound } from "next/navigation";
import Link from "next/link";
import { es } from "date-fns/locale";

interface Props {
  params: { id: string };
  searchParams: { query?: string };
}

export default async function ShowReservationsPage({
  params,
  searchParams,
}: Props) {
  const showId = parseInt(params.id); // Esto ya es correcto en una función async

  if (isNaN(showId)) return notFound();

  const queryValue =
    typeof searchParams?.query === "string"
      ? searchParams.query.toLowerCase()
      : "";

  const show = await prisma.show.findUnique({
    where: { id: showId },
    include: {
      Reservation: {
        include: {
          items: {
            include: {
              type: true,
            },
          },
        },
      },
    },
  });

  if (!show) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Reservas para el show del{" "}
        {new Date(show.date).toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </h1>

      <form method="get" className="mb-4">
        <input
          type="text"
          name="query"
          placeholder="Buscar por nombre, email o ID"
          defaultValue={queryValue || ""}
          className="border px-3 py-1 rounded w-full max-w-sm"
        />

        {queryValue && (
          <Link
            href={`/admin/shows/${params.id}`}
            className="ml-2 text-sm text-gray-600 underline font-sans"
          >
            Limpiar filtro
          </Link>
        )}
      </form>

      <table className="w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100 text-lg">
            <th className="border px-2 py-1">Cód. Reserva</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Entradas</th>
            <th className="border px-2 py-1">Fecha reserva</th>
          </tr>
        </thead>
        <tbody className="font-sans text-center">
          {show.Reservation.map((res) => (
            <tr key={res.id}>
              <td className="border px-2 py-1">{res.reservationCode}</td>
              <td className="border px-2 py-1">{res.customerName}</td>
              <td className="border px-2 py-1">{res.customerEmail}</td>
              <td className="border px-2 py-1">
                {res.items.map((item) => (
                  <div key={item.id}>
                    {item.quantity} × {item.type.name}
                  </div>
                ))}
              </td>
              <td className="border px-2 py-1">
                {new Date(res.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link
        href="/admin/shows"
        className="mt-4 inline-block text-blue-600 hover:underline"
      >
        ← Volver a shows
      </Link>
    </div>
  );
}
