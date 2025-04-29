"use client";

import { createUser, deleteUser } from "@/actions/userActions";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsersClient({ users }: { users: any[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    await createUser(formData);
    toast.success("✅ Usuario creado exitosamente!");

    setName("");
    setEmail("");
    setPassword("");

    router.refresh(); // Refresca la página para ver los nuevos datos
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Administración de Usuarios</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          className="border px-3 py-1 rounded w-1/3"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border px-3 py-1 rounded w-1/3"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="border px-3 py-1 rounded w-1/3"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
          Crear
        </button>
      </form>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border px-2 py-1">{user.id}</td>
              <td className="border px-2 py-1">{user.name}</td>
              <td className="border px-2 py-1">{user.email}</td>
              <td className="border px-2 py-1">
                <form
                  action={async () => {
                    await deleteUser(user.id);
                    router.refresh();
                  }}
                >
                  <button className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
