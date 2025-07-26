"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export function AdminHeader({ userName }: { userName: string }) {
  const [isPending, startTransition] = useTransition();
  const [showAccountingMenu, setShowAccountingMenu] = useState(false);
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return null;
  }

  return (
    <header className="p-4 flex justify-between items-center bg-gray-100 shadow font-sans relative">
      <h1 className="text-lg">Bienvenido, {userName}</h1>
      <nav className="flex space-x-4 items-center">
        <a href="/admin" className="text-blue-500 hover:underline">
          Inicio
        </a>
        <a href="/admin/shows" className="text-blue-500 hover:underline">
          Shows
        </a>
        <a href="/admin/reservations" className="text-blue-500 hover:underline">
          Reservas
        </a>

        {/* Contabilidad con dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setShowAccountingMenu(true)}
          onMouseLeave={() => setShowAccountingMenu(false)}
        >
          <button className="text-blue-500 hover:underline">Contabilidad ▾</button>
          {showAccountingMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow text-sm z-10">
              <a
                href="/admin/accounting/income"
                className="block px-4 py-2 hover:bg-gray-100 text-blue-600"
              >
                Ingresos
              </a>
              <a
                href="/admin/accounting/expenses"
                className="block px-4 py-2 hover:bg-gray-100 text-blue-600"
              >
                Egresos
              </a>
              <a
                href="/admin/accounting/closures"
                className="block px-4 py-2 hover:bg-gray-100 text-blue-600"
              >
                Cierres de caja
              </a>
            </div>
          )}
        </div>

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
