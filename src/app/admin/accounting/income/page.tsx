"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  getIncomesByMonth,
  createIncome,
  deleteIncome,
  updateIncome,
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
import { numberToMonth } from "../../../../../helpers";

export default function IncomePage() {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<string | null>(
    format(today, "yyyy-MM-dd")
  );
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [incomes, setIncomes] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState(format(today, "yyyy-MM-dd"));
  const [refresh, setRefresh] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIncomeId, setEditingIncomeId] = useState<number | null>(null);

  useEffect(() => {
    getIncomesByMonth(month, year).then((allIncomes) => {
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
      <h1 className="text-2xl font-bold mb-4">
        Ingresos - {numberToMonth(month)} de {year}
      </h1>

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
        <Button variant="outline" onClick={() => setSelectedDay(null)}>
          Ver todo el mes
        </Button>
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
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
          onChange={(e) => setYear(parseInt(e.target.value))}
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
              <DialogTitle>
                {isEditing ? "Editar ingreso" : "Nuevo ingreso"}
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
                <Label>Origen</Label>
                <Input
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
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

      <div className="flex justify-center mt-8 font-sans space-x-2">
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
    </div>
  );
}
