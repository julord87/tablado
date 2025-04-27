"use client";

import { signOut } from "next-auth/react"; // ⬅️ Import correcto
import { useTransition } from "react";

export function AdminHeader({ userName }: { userName: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <header className="p-4 flex justify-between items-center bg-gray-100 shadow">
      <h1 className="text-lg">Bienvenido, {userName}</h1>
      <button
        onClick={() => startTransition(() => signOut({ callbackUrl: "/admin/login" }))}
        disabled={isPending}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        {isPending ? "Saliendo..." : "Salir"}
      </button>
    </header>
  );
}
