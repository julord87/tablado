"use client";

import { useEffect, useState } from "react";
import { format, isWithinInterval, subDays, isSameDay } from "date-fns";
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
import { IncomeType, PaymentMethod } from "@prisma/client";
import { CloseDayCashButton } from "@/components";
import { incomeTypesArray } from "../../../../../utils/incomeTypes";

export default function IncomePage() {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<string | null>(
    format(today, "yyyy-MM-dd")
  );
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [totalAnual, setTotalAnual] = useState(0);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [type, setType] = useState<IncomeType | "">("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(format(today, "yyyy-MM-dd"));
  const [refresh, setRefresh] = useState(false);
  const [allMonthIncomes, setAllMonthIncomes] = useState<any[]>([]);
  const [isCashClosed, setIsCashClosed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");

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

  const updateMonthYearToPrev = () => {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    setMonth(prevMonth);
    setYear(prevYear);
  };

  const updateMonthYearToNext = () => {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    setMonth(nextMonth);
    setYear(nextYear);
  };

  const totalMes = allMonthIncomes.reduce((acc, curr) => acc + curr.amount, 0);

  useEffect(() => {
    getIncomesByMonth(month, year).then((allIncomes) => {
      setAllMonthIncomes(allIncomes);
      if (selectedDay) {
        const filtered = allIncomes.filter((i) =>
          isSameDay(new Date(i.date), baseDate)
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

  useEffect(() => {
    const checkCashStatus = async () => {
      const res = await fetch(
        "/api/is-cash-closed?date=" +
          (selectedDay ?? format(today, "yyyy-MM-dd"))
      );
      const data = await res.json();
      setIsCashClosed(data.closed);
    };
    checkCashStatus();
  }, [selectedDay, refresh]);

  const handleSubmit = async () => {
    if (!amount || !description || !date || !type || !paymentMethod) {
      toast.error("⚠️ Por favor completa todos los campos.");
      return;
    }

    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0); // fuerza a las 00:00 local

    const payload = {
      amount: parseFloat(amount),
      date: localDate.toISOString(),
      type,
      description: description || null,
      paymentMethod: paymentMethod || null,
    };

    if (isEditing && editingIncomeId !== null) {
      await updateIncome(editingIncomeId, payload);
      toast.success("✏️ Ingreso editado exitosamente!");
    } else {
      await createIncome(payload);
      toast.success("✅ Ingreso agregado exitosamente!");
    }

    resetForm();
    setRefresh(!refresh);
    setDialogOpen(false);
  };

  const handleEdit = (income: any) => {
    setAmount(income.amount.toString());
    setDate(format(new Date(income.date), "yyyy-MM-dd"));
    setEditingIncomeId(income.id);
    setIsEditing(true);
    setDialogOpen(true);
    setDescription(income.description || "");
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
    setDate(selectedDay || format(today, "yyyy-MM-dd"));
    setEditingIncomeId(null);
    setIsEditing(false);
    setDescription("");
  };

  return (
    <div className="m-8 space-y-6">
      <h2 className="text-2xl font-semibold mb-6">
        {getFormattedTitle(
          selectedDay ? new Date(selectedDay) : null,
          year,
          month,
          "Ingresos"
        )}
      </h2>

      <div className="flex gap-4 mb-4 font-sans">
        <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow w-48">
          <p className="text-sm font-medium">Total del día</p>
          <p className="text-xl font-bold">
            {selectedDay ? `$${totalDia.toFixed(2)}` : "--"}
          </p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow w-48">
          <p className="text-sm font-medium">Últimos 7 días</p>
          <p className="text-xl font-bold">
            {selectedDay ? `$${totalSemana.toFixed(2)}` : "--"}
          </p>
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow w-48">
          <p className="text-sm font-medium">Total del mes</p>
          <p className="text-xl font-bold">${totalMes.toFixed(2)}</p>
        </div>
        <div className="bg-purple-100 text-purple-800 p-4 rounded-xl shadow w-48">
          <p className="text-sm font-medium">Total año</p>
          <p className="text-xl font-bold">${totalAnual.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-4 font-sans my-8">
        <Input
          type="date"
          value={selectedDay ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedDay(value || null);
            setMonth(
              selectedDay ? parseInt(value.split("-")[1]) : today.getMonth() + 1
            );
            setYear(
              selectedDay ? parseInt(value.split("-")[0]) : today.getFullYear()
            );
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
                setMonth(prev.getMonth() + 1); // getMonth() es 0-based
                setYear(prev.getFullYear());
              } else {
                updateMonthYearToPrev();
              }
            }}
          >
            ← Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (selectedDay) {
                const next = new Date(selectedDay);
                next.setDate(next.getDate() + 1);
                setSelectedDay(format(next, "yyyy-MM-dd"));
                setMonth(next.getMonth() + 1);
                setYear(next.getFullYear());
              } else {
                updateMonthYearToNext();
              }
            }}
          >
            Siguiente →
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
          {Array.from({ length: 7 })
            .map((_, i) => today.getFullYear() - 3 + i)
            .concat(year) // incluye siempre el año actual si no está
            .filter((y, i, arr) => arr.indexOf(y) === i) // evitar duplicados
            .sort((a, b) => b - a) // orden descendente si querés
            .map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
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
                <div>
                  <Label>Monto</Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Label>Método de pago</Label>
                  <select
                    value={paymentMethod ?? ""}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="w-full p-2 border rounded capitalize"
                  >
                    <option value="" disabled>
                      --Seleccioná un método de pago--
                    </option>
                    {Object.values(PaymentMethod).map((value) => (
                      <option key={value} value={value} className="capitalize">
                        {value}
                      </option>
                    ))}
                    {/* Agregá los que uses */}
                  </select>
                  <Label>Tipo</Label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as IncomeType)}
                    className="w-full p-2 border rounded capitalize"
                  >
                    <option value="" disabled>
                      --Seleccioná una categoría--
                    </option>
                    {incomeTypesArray.map(({ value, label }) => (
                      <option key={value} value={value} className="capitalize">
                        {label}
                      </option>
                    ))}
                  </select>
                  <Label>Descripcion</Label>
                  <Input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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

        <CloseDayCashButton
          date={new Date(selectedDay ?? format(today, "yyyy-MM-dd"))}
          isCashClosed={isCashClosed}
          setIsCashClosed={setIsCashClosed}
          onCloseSuccess={() => setRefresh(!refresh)}
        />
      </div>

      <table className="w-full table-auto border mt-4 font-sans">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">Fecha</th>
            <th className="border px-2 py-1 text-left">Tipo</th>
            <th className="border px-2 py-1 text-left">Descripcion</th>
            <th className="border px-2 py-1 text-left">Creado por</th>
            <th className="border px-2 py-1 text-left">Monto</th>
            <th className="border px-2 py-1 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income.id}>
              <td className="border px-2 py-1">
                {format(new Date(income.date), "dd/MM/yyyy" + " HH:mm:ss")}
              </td>
              <td className="border px-2 py-1 capitalize">{(income.type).replace("_", " ")}</td>
              <td className="border px-2 py-1">
                {income.description || "Sin descripción"}
              </td>
              <td className="border px-2 py-1">{income?.user.name || "Desconocido"}</td>
              {/* Cambia esto por el nombre del usuario que creó el ingreso */}
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
          <tr className="bg-gray-50 font-semibold text-lg">
            <td colSpan={4} className="border px-2 py-1 text-right">
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
