import { getShowsWithReservationsByDate } from "@/actions/showActions";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function AdminReservationsPage() {
  const today = new Date();
  const shows = await getShowsWithReservationsByDate(today);

  return (
    <div className="m-8 space-y-6">
      <h1 className="text-4xl font-bold mb-4">Reservas para hoy</h1>

      {shows.length === 0 ? (
        <p>No hay shows programados para hoy.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((show) => {
            const totalVendidos = show.Reservation.reduce((sum, r) => {
              return (
                sum +
                r.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
              );
            }, 0);

            return (
              <div key={show.id} className="border rounded-xl p-4 shadow bg-neutral-50">
                <h2 className="text-2xl font-semibold mb-2">
                  {show.time} hs
                </h2>
                <p className="mb-4">
                  Capacidad: {show.capacity} – Vendidos: {totalVendidos}
                </p>

                {show.Reservation.length === 0 ? (
                  <p className="text-gray-500">Sin reservas aún.</p>
                ) : (
                  <ul className="space-y-2 bg-white">
                    {show.Reservation.map((res) => (
                      <li
                        key={res.id}
                        className="border rounded p-2 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                      >
                        <div className="font-sans">
                          <strong>{res.customerName}</strong> –{" "}
                          {res.customerEmail}
                          <div className="text-sm text-gray-600">
                            {res.items
                              .map(
                                (item) =>
                                  `${item.quantity} x ${item.type.name}`
                              )
                              .join(" + ")}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 sm:mt-0 font-sans">
                          {format(new Date(res.createdAt), "dd/MM/yyyy", {
                            locale: es,
                          })}{" "}
                          {format(new Date(res.createdAt), "HH:mm")}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
