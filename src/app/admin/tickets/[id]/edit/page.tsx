import { getTicketTypeById, updateTicketType } from "@/actions/ticketTypeActions";
import { notFound, redirect } from "next/navigation";

interface EditTicketPageProps {
  params: { id: string };
}

export default async function EditTicketPage({ params }: EditTicketPageProps) {
  const ticket = await getTicketTypeById(Number(params.id));

  if (!ticket) {
    notFound();
  }

  const handleSubmit = async (formData: FormData) => {
    "use server";

    const name = formData.get("name")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const priceString = formData.get("price")?.toString() || "";

    if (!name || !description || !priceString) {
      console.error("Faltan campos!");
      return;
    }

    const price = parseFloat(priceString);
    if (isNaN(price)) {
      console.error("Precio inválido!");
      return;
    }

    await updateTicketType(ticket.id, { name, description, price });

    redirect("/admin?message=Entrada editada!");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar entrada</h1>
      <form action={handleSubmit} className="grid gap-4 max-w-md">
        <input
          type="text"
          name="name"
          placeholder="Nombre de la entrada"
          defaultValue={ticket.name}
          required
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Descripción"
          defaultValue={ticket.description || ""}
          required
          className="border p-2 rounded font-sans"
        />
        <input
          type="number"
          name="price"
          step="0.01"
          placeholder="Precio (€)"
          defaultValue={ticket.price}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-sans"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
