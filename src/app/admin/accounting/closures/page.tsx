"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // asegurate de tenerlo
import { getCashClosuresByMonth } from "@/actions/accountingActions"; // 👈 tenés que crear esta action
import { Button } from "@/components/ui/button";

export default function CashClosuresPage() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [closures, setClosures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClosure, setSelectedClosure] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getCashClosuresByMonth(month, year);
      setClosures(res);
      setLoading(false);
    })();
  }, [month, year]);

  return (
    <div className="m-8 space-y-6">
      <h2 className="text-2xl font-bold">
        Cierres de caja -{" "}
        {format(new Date(year, month - 1), "MMMM yyyy", { locale: es })}
      </h2>

      <div className="flex font-sans gap-4 items-center">
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          className="border p-2 rounded"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {format(new Date(2023, i), "MMMM", { locale: es })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="border p-2 rounded"
        >
          {Array.from({ length: 7 }).map((_, i) => {
            const y = today.getFullYear() - 3 + i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      <table className="w-full border mt-6 font-sans">
        <thead>
          <tr className="bg-neutral-100">
            <th className="border px-2 py-1 text-left">Fecha</th>
            <th className="border px-2 py-1 text-left">Ingresos</th>
            <th className="border px-2 py-1 text-left">Egresos</th>
            <th className="border px-2 py-1 text-left">Balance</th>
            <th className="border px-2 py-1 text-left">Usuario</th>
            <th className="border px-2 py-1 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {closures.map((cierre) => (
            <tr key={cierre.id}>
              <td className="border px-2 py-1">
                {format(new Date(cierre.date), "dd/MM/yyyy")}
              </td>
              <td className="border px-2 py-1 text-green-700 font-medium">
                € {cierre.totalIncomes?.toFixed(2) ?? "-"}
              </td>
              <td className="border px-2 py-1 text-yellow-700 font-medium">
                € {cierre.totalExpenses?.toFixed(2) ?? "-"}
              </td>
              <td
                className={`border px-2 py-1 font-bold ${
                  cierre.total >= 0 ? "text-blue-700" : "text-red-700"
                }`}
              >
                € {cierre.total.toFixed(2)}
              </td>
              <td className="border px-2 py-1">{cierre.user?.name ?? "—"}</td>
              <td className="border px-2 py-1">
                <Button
                  variant="outline"
                  onClick={() => setSelectedClosure(cierre)}
                >
                  Ver detalle
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedClosure && (
        <Dialog open={true} onOpenChange={() => setSelectedClosure(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Cierre del{" "}
                {format(new Date(selectedClosure.date), "dd/MM/yyyy")}
              </DialogTitle>
              <hr className="my-4" />
            </DialogHeader>
            <div className="space-y-4 font-sans text-sm text-stone-700 max-h-[75vh] overflow-y-auto pr-2">
              <div>
                <h3 className="text-base font-bold mb-2">💰 Ingresos</h3>
                {selectedClosure.incomes.length > 0 ? (
                  <ul className="space-y-1">
                    {selectedClosure.incomes.map((i: any) => (
                      <li key={i.id} className="flex justify-between gap-x-4">
                        <span className="capitalize">
                          {format(new Date(i.date), "dd/MM HH:mm")} · {i.type.replace(/_/g, " ")} · <em>{i.description}</em>
                        </span>
                        <span className="text-green-700 tabular-nums min-w-[80px] text-right">
                          € {i.amount.toFixed(2)}
                        </span>
                      </li>
                    ))}
                    {selectedClosure.incomes.length > 0 && (
                      <li className="flex justify-between border-t pt-2 mt-2 text-green-900 font-semibold">
                        <span>Total ingresos</span>
                        <span className="tabular-nums">
                          € {selectedClosure.totalIncomes?.toFixed(2)}
                        </span>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    Sin ingresos registrados.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold mt-6 mb-2">💸 Egresos</h3>
                {selectedClosure.expenses.length > 0 ? (
                  <ul className="space-y-1">
                    {selectedClosure.expenses.map((e: any) => (
                      <li key={e.id} className="flex justify-between">
                        <span>
                          {format(new Date(e.date), "dd/MM HH:mm")} {e.type} ·{" "}
                          <em>{e.description}</em>
                        </span>
                        <span className="text-yellow-800">
                          € {e.amount.toFixed(2)}
                        </span>
                      </li>
                    ))}
                    {selectedClosure.expenses.length > 0 && (
                      <li className="flex justify-between border-t pt-2 mt-2 text-yellow-900 font-semibold">
                        <span>Total egresos</span>
                        <span className="tabular-nums">
                          € {selectedClosure.totalExpenses?.toFixed(2)}
                        </span>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    Sin egresos registrados.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold mt-6 mb-2">
                  🎟️ Tickets vendidos
                </h3>
                {selectedClosure.tickets.length > 0 ? (
                  <ul className="space-y-1">
                    {selectedClosure.tickets.map((t: any) => (
                      <li key={t.id}>
                        {t.quantity} x {t.type.name} – €{" "}
                        {t.type.price.toFixed(2)} c/u
                      </li>
                    ))}
                    {selectedClosure.tickets.length > 0 && (
                      <li className="flex justify-between border-t pt-2 mt-2 text-green-900 font-semibold">
                        <span>Total cantidad tickets vendidos</span>
                        <span className="tabular-nums">
                            {selectedClosure.tickets.reduce(
                                (sum: number, t: any) => sum + t.quantity,
                                0
                            )}
                        </span>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    No se registraron tickets.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold mt-6 mb-2">📅 Shows</h3>
                {selectedClosure.shows.length > 0 ? (
                  <ul className="space-y-1">
                    {selectedClosure.shows.map((s: any) => (
                      <li key={s.id}>
                        Show: {format(new Date(s.date), "dd/MM/yyyy")} ·{" "}
                        {s.time}hs
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">Sin shows asociados.</p>
                )}

                <hr className="my-4" />
                <p className="text-xs text-center text-gray-500">
                  Registrado el{" "}
                  {format(
                    new Date(selectedClosure.createdAt),
                    "dd/MM/yyyy HH:mm"
                  )}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
