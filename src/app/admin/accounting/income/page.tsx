"use client";

import { useEffect, useState } from "react";
import { format, isWithinInterval, subDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  getIncomesByMonth,
  createIncome,
  deleteIncome,
  updateIncome,
  getIncomesByYear,
} from "../../../../actions/accountingActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getFormattedTitle, numberToMonth } from "../../../../../helpers";

export default function IncomePage() {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<string | null>(
    format(today, "yyyy-MM-dd")
  );
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [totalAnual, setTotalAnual] = useState(0);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState(format(today, "yyyy-MM-dd"));
  const [refresh, setRefresh] = useState(false);
  const [allMonthIncomes, setAllMonthIncomes] = useState<any[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIncomeId, setEditingIncomeId] = useState<number | null>(null);

  const baseDate = selectedDay ? new Date(selectedDay) : today;

  const totalDia = allMonthIncomes
    .filter(
      (i) =>
        format(new Date(i.date), "yyyy-MM-dd") ===
        format(baseDate, "yyyy-MM-dd")
    )
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSemana = allMonthIncomes
    .filter((i) =>
      isWithinInterval(new Date(i.date), {
        start: subDays(baseDate, 6),
        end: baseDate,
      })
    )
    .reduce((acc, curr) => acc + curr.amount, 0);

  const updateMonthYearFromDate = (date: Date) => {
    setMonth(date.getMonth() + 1);
    setYear(date.getFullYear());
  };

  const totalMes = allMonthIncomes.reduce((acc, curr) => acc + curr.amount, 0);

  useEffect(() => {
    getIncomesByMonth(month, year).then((allIncomes) => {
      setAllMonthIncomes(allIncomes);
      if (selectedDay) {
        const filtered = allIncomes.filter(
          (i) => format(new Date(i.date), "yyyy-MM-dd") === selectedDay
        );
        setIncomes(filtered);
      } else {
        setIncomes(allIncomes);
      }
    });
  }, [month, year, refresh, selectedDay]);

  useEffect(() => {
    getIncomesByYear(year).then((res) => {
      const total = res.reduce((acc, curr) => acc + curr.amount, 0);
      setTotalAnual(total);
    });
  }, [year, refresh]);

  const handleSubmit = async () => {
    if (!amount || !source || !date) return alert("Faltan datos");

    if (isEditing && editingIncomeId !== null) {
      await updateIncome(editingIncomeId, {
        amount: parseFloat(amount),
        source,
        date,
      });
      toast.success("✏️ Ingreso editado exitosamente!");
    } else {
      await createIncome({ amount: parseFloat(amount), source, date });
      toast.success("✅ Ingreso agregado exitosamente!");
    }

    resetForm();
    setRefresh(!refresh);
    setDialogOpen(false);
  };

  const handleEdit = (income: any) => {
    setAmount(income.amount.toString());
    setSource(income.source);
    setDate(format(new Date(income.date), "yyyy-MM-dd"));
    setEditingIncomeId(income.id);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este ingreso?")) {
      await deleteIncome(id);
      toast.success("🗑️ Ingreso eliminado!");
      setRefresh(!refresh);
    }
  };

  const resetForm = () => {
    setAmount("");
    setSource("");
    setDate(format(today, "yyyy-MM-dd"));
    setEditingIncomeId(null);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {getFormattedTitle(selectedDay ? new Date(selectedDay) : null, year, month)}
      </h2>

      <div className="flex gap-4 mb-4 font-sans">
        <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow w-48">
          <p className="text-sm font-medium">Total del día</p>
          <p className="text-xl font-bold">${totalDia.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow w-48">
          <p className="text-sm font-medium">Últimos 7 días</p>
          <p className="text-xl font-bold">${totalSemana.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow w-48">
          <p className="text-sm font-medium">Total del mes</p>
          <p className="text-xl font-bold">
            ${totalMes.toLocaleString("es-ES")}
          </p>
        </div>
        <div className="bg-purple-100 text-purple-800 p-4 rounded-xl shadow w-48">
          <p className="text-sm font-medium">Total año</p>
          <p className="text-xl font-bold">
            ${totalAnual.toLocaleString("es-ES")}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-4 font-sans">
        <Input
          type="date"
          value={selectedDay ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedDay(value || null);
          }}
          className="p-2 rounded border"
        />

        <div className="flex justify-center font-sans space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              if (selectedDay) {
                const prev = new Date(selectedDay);
                prev.setDate(prev.getDate() - 1);
                setSelectedDay(format(prev, "yyyy-MM-dd"));
              }
            }}
          >
            ← Día anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (selectedDay) {
                const next = new Date(selectedDay);
                next.setDate(next.getDate() + 1);
                setSelectedDay(format(next, "yyyy-MM-dd"));
              }
            }}
          >
            Día siguiente →
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            if (selectedDay) updateMonthYearFromDate(new Date(selectedDay));
            setSelectedDay(null);
          }}
        >
          Ver todo el mes
        </Button>

        <select
          value={month}
          onChange={(e) => {
            setMonth(parseInt(e.target.value));
            setSelectedDay(null); // ← Limpiar selectedDay
          }}
          className="border p-2 rounded"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => {
            setYear(parseInt(e.target.value));
            setSelectedDay(null); // ← Limpiar selectedDay
          }}
          className="border p-2 rounded"
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const y = today.getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
            >
              + Agregar ingreso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {isEditing ? "Editar ingreso" : "Nuevo ingreso"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 font-sans">
              <div>
                <Label>Origen</Label>
                <Input
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
                <div>
                  <Label>Monto</Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <Button onClick={handleSubmit}>
                {isEditing ? "Guardar cambios" : "Guardar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <table className="w-full table-auto border mt-4 font-sans">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">Fecha</th>
            <th className="border px-2 py-1 text-left">Origen</th>
            <th className="border px-2 py-1 text-left">Monto</th>
            <th className="border px-2 py-1 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income.id}>
              <td className="border px-2 py-1">
                {format(new Date(income.date), "dd/MM/yyyy")}
              </td>
              <td className="border px-2 py-1">{income.source}</td>
              <td className="border px-2 py-1">${income.amount.toFixed(2)}</td>
              <td className="border px-2 py-1 space-x-2">
                <Button size="sm" onClick={() => handleEdit(income)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(income.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-semibold text-lg">
            <td colSpan={2} className="border px-2 py-1 text-right">
              Total
            </td>
            <td className="border px-2 py-1">
              ${incomes.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
            </td>
            <td className="border px-2 py-1" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
