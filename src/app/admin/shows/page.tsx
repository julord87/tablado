// src/app/admin/shows/page.tsx

import { getShows } from "@/actions/showActions";
import Link from "next/link";
import { DeleteShowButton } from "@/components/admin/DeleteShowButton";

export default async function AdminShowsPage() {
  const shows = await getShows();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Shows</h1>
        <Link
          href="/admin/shows/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-sans"
        >
          Crear Show
        </Link>
      </div>

      {shows.length === 0 ? (
        <p>No hay shows programados.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-lg">
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Hora</th>
              <th className="p-2 border">Capacidad</th>
              <th className="p-2 border">Tickets vendidos</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show) => (
              <tr key={show.id} className="text-center font-sans">
                <td className="border p-2">
                  {new Date(show.date).toLocaleDateString()}
                </td>
                <td className="border p-2">{show.time}</td>
                <td className="border p-2">{show.capacity}</td>
                <td className="border p-2">{show._count.tickets}</td>
                <td className="border p-2 space-x-2">
                  <Link href={`/admin/shows/${show.id}`}>
                    <button className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                      Detalle
                    </button>
                  </Link>
                  <Link
                    href={`/admin/shows/${show.id}/edit`}
                    className="bg-rose-400 text-white px-2 py-1 rounded hover:bg-rose-500 text-sm"
                  >
                    Editar
                  </Link>
                  <DeleteShowButton id={show.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
