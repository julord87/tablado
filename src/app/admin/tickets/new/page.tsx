"use client";

import { createTicketType } from "@/actions/ticketTypeActions";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const handleSubmit = async (formData: FormData) => {
  const name = formData.get("name")?.toString() || "";
  const priceString = formData.get("price")?.toString() || "";
  const description = formData.get("description")?.toString() || "";

  if (!name || !priceString || !description) {
    console.error("Faltan campos!");
    return;
  }

  const price = parseFloat(priceString);
  if (isNaN(price)) {
    console.error("Precio inválido!");
    return;
  }

  await createTicketType({ name, price, description });

  toast.success("Entrada creada exitosamente"); // Mostramos el toast
  setTimeout(() => {
    redirect("/admin/tickets");
  }, 2000);
};

const NewTicketPage = () => {
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
          className="border p-2 rounded font-sans"
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
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-sans"
        >
          Crear
        </button>
      </form>
    </div>
  );
};

export default NewTicketPage;
