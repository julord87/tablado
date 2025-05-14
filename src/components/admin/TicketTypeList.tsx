import { getTicketTypes } from "@/actions/ticketTypeActions";
import { DeleteTicketButton } from "./DeleteTicketButton"; // 👈 nuevo import
import Link from "next/link";

export default async function TicketTypeList() {
  const ticketTypes = await getTicketTypes();

  return (
    <div className="m-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/admin/tickets/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-sans"
        >
          Crear nueva entrada
        </Link>
      </div>
      <div className="grid gap-4">
        {ticketTypes.map((ticket) => (
          <div
            key={ticket.id}
            className="p-4 border rounded shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-bold">{ticket.name}</h3>
              <p className="text-sm text-gray-600">{ticket.description}</p>
              <p className="text-md text-green-700 font-semibold">{ticket.price} €</p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/admin/tickets/${ticket.id}/edit`}
                className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition text-sm font-sans"
              >
                Editar
              </Link>

              <DeleteTicketButton id={ticket.id} /> {/* 👈 nuestro botoncito */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
