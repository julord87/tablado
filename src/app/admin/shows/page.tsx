// src/app/admin/shows/page.tsx

import { getShows } from "@/actions/showActions";
import Link from "next/link";

export default async function ShowListPage() {
  const shows = await getShows();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Shows</h1>

      <Link
        href="/admin/shows/new"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Crear Show
      </Link>

      <div className="mt-6">
        {shows.length === 0 ? (
          <p>No hay shows programados.</p>
        ) : (
          <table className="w-full mt-4">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Fecha</th>
                <th className="py-2">Horario</th>
                <th className="py-2">Capacidad</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show) => (
                <tr key={show.id} className="border-b">
                  <td className="py-2">{new Date(show.date).toLocaleDateString()}</td>
                  <td className="py-2">{show.time.replace('_', '').replace('_', ':')}</td>
                  <td className="py-2">{show.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
