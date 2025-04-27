import { createTicketType } from "@/actions/ticketTypeActions";
import { redirect } from "next/navigation";

export default function NewTicketTypePage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);

    await createTicketType({ name, description, price });

    redirect("/admin");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Crear nueva entrada</h1>
      <form action={handleSubmit} className="grid gap-4 max-w-md">
        <input
          type="text"
          name="name"
          placeholder="Nombre de la entrada"
          required
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Descripción"
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          step="0.01"
          placeholder="Precio (€)"
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Crear
        </button>
      </form>
    </div>
  );
}
