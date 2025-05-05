"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  getExpensesByMonth,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseTotals,
} from "@/actions/expensesActions";
import { expenseCategories } from "../../../../../utils/expenseCategories";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getFormattedTitle } from "../../../../../helpers";

export default function ExpensePage() {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<string | null>(
    format(today, "yyyy-MM-dd")
  );
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [expenses, setExpenses] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(false);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(format(today, "yyyy-MM-dd"));

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [totales, setTotales] = useState({
    totalDia: 0,
    totalSemana: 0,
    totalMes: 0,
    totalAnual: 0,
  });

  useEffect(() => {
    if (selectedDay) {
      const fechaSeleccionada = new Date(selectedDay);
      getExpenseTotals(fechaSeleccionada).then(setTotales);
    } else {
      getExpenseTotals(null, month, year).then(setTotales);
    }
  }, [selectedDay, month, year, refresh]);

  useEffect(() => {
    getExpensesByMonth(month, year).then((res) => {
      if (selectedDay) {
        const filtered = res.filter(
          (e) => format(new Date(e.date), "yyyy-MM-dd") === selectedDay
        );
        setExpenses(filtered);
      } else {
        setExpenses(res);
      }
    });
  }, [month, year, selectedDay, refresh]);

  const handleSubmit = async () => {
    if (!amount || !category || !date) return toast.error("Faltan datos");

    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);

    const payload = {
      amount: parseFloat(amount),
      category,
      description,
      date: localDate.toISOString(),
    };

    if (isEditing && editingId !== null) {
      await updateExpense(editingId, payload);
      toast.success("✏️ Egreso editado!");
    } else {
      await createExpense(payload);
      toast.success("✅ Egreso agregado!");
    }

    resetForm();
    setRefresh(!refresh);
    setDialogOpen(false);
  };

  const updateMonthYearFromDate = (date: Date) => {
    setMonth(date.getMonth() + 1);
    setYear(date.getFullYear());
  };

  const nextMonthYear = () => {
    const nextDate = new Date(year, month - 1, 1); // 👈 esto es correcto
    nextDate.setMonth(nextDate.getMonth() + 1);
    setMonth(nextDate.getMonth() + 1); // 👈 recordá devolverlo a base 1
    setYear(nextDate.getFullYear());
  };

  const prevMonthYear = () => {
    const prevDate = new Date(year, month - 1, 1); // 👈 esto es correcto
    prevDate.setMonth(prevDate.getMonth() - 1);
    setMonth(prevDate.getMonth() + 1); // 👈 recordá devolverlo a base 1
    setYear(prevDate.getFullYear());
  };

  const handleEdit = (expense: any) => {
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDescription(expense.description || "");
    setDate(format(new Date(expense.date), "yyyy-MM-dd"));
    setEditingId(expense.id);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleVerTodoElMes = () => {
    if (selectedDay) {
      const fecha = new Date(selectedDay);
      updateMonthYearFromDate(fecha);
      setSelectedDay(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar este egreso?")) {
      await deleteExpense(id);
      toast.success("🗑️ Egreso eliminado!");
      setRefresh(!refresh);
    }
  };

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(format(today, "yyyy-MM-dd"));
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {getFormattedTitle(
          selectedDay ? new Date(selectedDay) : null,
          year,
          month,
          "Egresos"
        )}
      </h2>

      <div className="flex gap-4 mb-4 font-sans">
        <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow w-48">
          <p className="text-sm font-medium">Total del día</p>
          <p className="text-xl font-bold">
            {selectedDay ? `$${totales.totalDia.toFixed(2)}` : "--"}
          </p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow w-48">
          <p className="text-sm font-medium">Últimos 7 días</p>
          <p className="text-xl font-bold">
            {selectedDay ? `${totales.totalSemana.toFixed(2)}` : "--"}
          </p>
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow w-48">
          <p className="text-sm font-medium">Total del mes</p>
          <p className="text-xl font-bold">${totales.totalMes.toFixed(2)}</p>
        </div>
        <div className="bg-purple-100 text-purple-800 p-4 rounded-xl shadow w-48">
          <p className="text-sm font-medium">Total año</p>
          <p className="text-xl font-bold">${totales.totalAnual.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-1 font-sans items-center">
        <Input
          type="date"
          value={selectedDay ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              setSelectedDay(value);
              updateMonthYearFromDate(new Date(value));
            }
          }}
        />
        <div className="flex gap-4 mb-4 font-sans items-end">
          <div className="flex flex-col gap-1">
            <Label className="invisible">Placeholder</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedDay) {
                    const prev = new Date(selectedDay);
                    prev.setDate(prev.getDate() - 1);
                    setSelectedDay(format(prev, "yyyy-MM-dd"));
                    updateMonthYearFromDate(prev);
                  } else {
                    prevMonthYear();
                  }
                }}
              >
                ← Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedDay) {
                    const prev = new Date(selectedDay);
                    prev.setDate(prev.getDate() + 1);
                    setSelectedDay(format(prev, "yyyy-MM-dd"));
                    updateMonthYearFromDate(prev);
                  } else {
                    nextMonthYear();
                  }
                }}
              >
                Siguiente →
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="invisible">Placeholder</Label>
            <Button variant="outline" onClick={handleVerTodoElMes}>
              Ver todo el mes
            </Button>
          </div>
        </div>
        <select
          value={month}
          onChange={(e) => setMonth(+e.target.value)}
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
          onChange={(e) => setYear(+e.target.value)}
          className="border p-2 rounded"
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const baseYear = Math.max(today.getFullYear(), year);
            const y = baseYear - (4 - i);
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-sans" onClick={resetForm}>
              + Agregar egreso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {isEditing ? "Editar egreso" : "Nuevo egreso"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 font-sans">
              <div>
                <Label>Monto</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <Label>Categoría</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="" disabled>
                    --Selecciona una categoría--
                  </option>
                  {expenseCategories.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Descripción</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
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

      <table className="w-full table-auto border font-sans">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 text-left">Fecha</th>
            <th className="border px-2 py-1 text-left">Categoría</th>
            <th className="border px-2 py-1 text-left">Descripción</th>
            <th className="border px-2 py-1 text-left">Monto</th>
            <th className="border px-2 py-1 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id}>
              <td className="border px-2 py-1">
                {format(new Date(e.date), "dd/MM/yyyy")}
              </td>
              <td className="border px-2 py-1 capitalize">{e.category}</td>
              <td className="border px-2 py-1">{e.description || "-"}</td>
              <td className="border px-2 py-1">${e.amount.toFixed(2)}</td>
              <td className="border px-2 py-1 space-x-2">
                <Button size="sm" onClick={() => handleEdit(e)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(e.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50 font-semibold text-lg">
            <td colSpan={3} className="border px-2 py-1 text-right">
              Total
            </td>
            <td className="border px-2 py-1">
              $
              {selectedDay
                ? totales.totalDia.toFixed(2)
                : totales.totalMes.toFixed(2)}
            </td>
            <td className="border px-2 py-1" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
