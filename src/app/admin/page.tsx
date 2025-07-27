"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getAccountingTotals,
  isCashClosedForToday,
  getLastIncomes,
} from "@/actions";
import { getLastExpenses } from "@/actions/expensesActions";
import { getShows } from "@/actions/showActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CashClosureCard from "@/components/admin/CashClosureCard";

export default function AdminDashboardPage() {
  const [resumen, setResumen] = useState<any>(null);
  const [cashClosed, setCashClosed] = useState<boolean>(false);
  const [lastIncomes, setLastIncomes] = useState<any[]>([]);
  const [lastExpenses, setLastExpenses] = useState<any[]>([]);
  const [nextShows, setNextShows] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const [resumenData, closed, incomes, expenses, shows] = await Promise.all(
        [
          getAccountingTotals(today),
          isCashClosedForToday(),
          getLastIncomes(3),
          getLastExpenses(3),
          getShows(),
        ]
      );
      setResumen(resumenData);
      setCashClosed(closed);
      setLastIncomes(incomes);
      setLastExpenses(expenses);
      setNextShows(shows.slice(0, 3));
    };
    fetchData();
  }, []);

  if (!resumen) return <p className="p-8">Cargando datos...</p>;

  return (
    <div className="space-y-8 m-8">
      <h1 className="text-4xl font-bold">Panel de Administración</h1>

      {/* Accesos rápidos */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Accesos Rápidos</h2>
        <div className="flex flex-wrap gap-2 font-sans">
          <Link href="/admin/accounting/income">
            <Button variant="outline">➕ Ingresos</Button>
          </Link>
          <Link href="/admin/accounting/expense">
            <Button variant="outline">➖ Egresos</Button>
          </Link>
          <Link href="/admin/shows">
            <Button variant="outline">🎭 Shows</Button>
          </Link>
          <Link href="/admin/reservations">
            <Button variant="outline">📑 Reservas</Button>
          </Link>
          <Link href="/admin/accounting/closures">
            <Button variant="outline">🧾 Cierres</Button>
          </Link>
        </div>
      </div>

      {/* Resumen Diario */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-green-100 text-green-800">
          <Link href="/admin/accounting/income">
            <CardContent className="p-4">
              <p className="text-sm">Ingresos hoy</p>
              <p className="text-xl font-bold">
                € {resumen.ingresosHoy.toFixed(2)}
              </p>
            </CardContent>
          </Link>
        </Card>
        <Card className="bg-yellow-100 text-yellow-800">
          <Link href="/admin/accounting/expense">
            <CardContent className="p-4">
              <p className="text-sm">Egresos hoy</p>
              <p className="text-xl font-bold">
                € {resumen.egresosHoy.toFixed(2)}
              </p>
            </CardContent>
          </Link>
        </Card>
        <Card className="bg-blue-100 text-blue-800">
          <Link href="/admin/accounting">
            <CardContent className="p-4">
              <p className="text-sm">Balance hoy</p>
              <p className="text-xl font-bold">
                € {(resumen.ingresosHoy - resumen.egresosHoy).toFixed(2)}
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Btn de cierre de caja */}
      <CashClosureCard />

      {/* Proximos Shows */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Próximos Shows</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {nextShows.length === 0 && (
            <p className="text-gray-500">No hay shows programados.</p>
          )}
          {nextShows.map((show) => (
            <Card key={show.id} className="bg-white">
              <CardContent className="p-4">
                <p>
                  📅 {new Date(show.date).toLocaleDateString()} - {show.time}
                </p>
                <p>🎫 Capacidad: {show.capacity}</p>
                <p>
                  ✅ Reservas:{" "}
                  {show.Reservation.reduce(
                    (acc: number, r: { items: { quantity: number }[] }) =>
                      acc +
                      r.items.reduce(
                        (s: number, i: { quantity: number }) => s + i.quantity,
                        0
                      ),
                    0
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Últimos Movimientos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
        <Card className="bg-stone-50">
          <Link href="/admin/accounting/income">
            <CardHeader>
              <CardTitle>Últimos Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lastIncomes.map((i) => (
                  <li key={i.id} className="text-sm">
                    {new Date(i.date).toLocaleString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}{" "}
                    💰 {i.description} — € {i.amount}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Link>
        </Card>

        <Card className="bg-stone-50">
          <Link href="/admin/accounting/expense">
            <CardHeader>
              <CardTitle>Últimos Egresos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lastExpenses.map((e) => (
                  <li key={e.id} className="text-sm">
                    {new Date(e.date).toLocaleString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}{" "}
                    📤 {e.description} — € {e.amount}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
