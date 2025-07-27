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
    <header className="p-4 flex justify-start items-center bg-gray-100 shadow font-sans relative">
      <h1 className="text-lg">Bienvenido, {userName} { userName === "Julián" ? "👨" : "👩" }</h1>
      <div className="flex-grow"></div>
      
      {/* Navigation links */}  
      <nav className="flex space-x-4 items-center text-sm justify-end">
        <a href="/admin" className="hover:text-gray-500">
          Inicio
        </a>
        <a href="/admin/shows" className="hover:text-gray-500">
          Shows
        </a>
        <a href="/admin/reservations" className="hover:text-gray-500">
          Reservas
        </a>

        {/* Contabilidad con dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setShowAccountingMenu(true)}
          onMouseLeave={() => setShowAccountingMenu(false)}
        >
          <button className="hover:text-gray-500">Contabilidad ▾</button>
          {showAccountingMenu && (
            <div className="absolute top-full left-0 mt-1 text-gray-800 bg-white border rounded shadow z-10">
              <a
                href="/admin/accounting"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Panel
              </a>
              <a
                href="/admin/accounting/income"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Ingresos
              </a>
              <a
                href="/admin/accounting/expenses"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Egresos
              </a>
              <a
                href="/admin/accounting/closures"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Cierres de caja
              </a>
            </div>
          )}
        </div>

        <a href="/admin/tickets" className="hover:text-gray-500">
          Tickets
        </a>
        <a href="/admin/users" className="hover:text-gray-500">
          Usuarios
        </a>
      </nav>

      <button
        onClick={() =>
          startTransition(() => signOut({ callbackUrl: "/admin/login" }))
        }
        disabled={isPending}
        className="px-4 py-2 hover:text-gray-500"
      >
        {isPending ? "Saliendo..." : "🏃‍♂️💨"}
      </button>
    </header>
  );
}
