"use client";

import { signOut } from "next-auth/react"; // ⬅️ Import correcto
import { useTransition } from "react";
import { usePathname } from "next/navigation";

export function AdminHeader({ userName }: { userName: string }) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return null; // No mostrar el header en la página de login
  }

  return (
    <header className="p-4 flex justify-between items-center bg-gray-100 shadow font-sans">
      <h1 className="text-lg">Bienvenido, {userName}</h1>
      <nav className="flex space-x-4">
        <a href="/admin" className="text-blue-500 hover:underline">
          Inicio
        </a>
        <a href="/admin/shows" className="text-blue-500 hover:underline">
          Shows
        </a>
        <a href="/admin/tickets" className="text-blue-500 hover:underline">
          Tickets
        </a>
        <a href="/admin/users" className="text-blue-500 hover:underline">
          Usuarios
        </a>
      </nav>

      <button
        onClick={() =>
          startTransition(() => signOut({ callbackUrl: "/admin/login" }))
        }
        disabled={isPending}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        {isPending ? "Saliendo..." : "Salir"}
      </button>
    </header>
  );
}
