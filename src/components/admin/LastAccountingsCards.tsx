"use client";

import { useEffect, useState } from "react";
import {
  getAverageDailyIncome,
  getIncomeByPaymentMethod,
  getLastIncomes,
} from "@/actions/accountingActions";
import { getLastExpenses } from "@/actions/expensesActions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type IncomeItem = {
  id: string;
  description: string | null;
  amount: number;
  date: Date;
};

type ExpenseItem = {
  id: string;
  description: string | null;
  amount: number;
  date: Date;
};

export default function LastMovements() {
  const [incomes, setIncomes] = useState<IncomeItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [incomeByMethod, setIncomeByMethod] = useState<
    { method: string; total: number }[]
  >([]);
  const [avgIncome, setAvgIncome] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const [i, e, byMethod, avg] = await Promise.all([
        getLastIncomes(),
        getLastExpenses(),
        getIncomeByPaymentMethod(),
        getAverageDailyIncome(),
      ]);

      setIncomes(i.map((income) => ({ ...income, id: income.id.toString() })));
      setExpenses(
        e.map((expense) => ({ ...expense, id: expense.id.toString() }))
      );
      setIncomeByMethod(byMethod);
      setAvgIncome(avg.average);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-stone-50">
        <CardHeader className="">
          <p className="font-semibold">Últimos ingresos</p>
        </CardHeader>
        <CardContent className="ml-0 space-y-2 font-sans">
          {incomes.length > 0 ? (
            incomes.map((i) => (
              <div
                key={i.id}
                className="flex justify-between text-sm text-stone-700"
              >
                <span>
                  {i.description || "Sin descripción"} -{" "}
                  {format(new Date(i.date), "dd/MM", { locale: es })}
                </span>
                <span className="font-semibold">€ {i.amount.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay ingresos recientes
            </p>
          )}
          <Link href="/admin/accounting/income">
            <Button
              className="font-sans mt-6 w-full border-neutral-900 bg-stone-200 hover:bg-stone-300 transition"
              variant="link"
            >
              Ver todos
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="bg-stone-50">
        <CardHeader>
          <p className="font-semibold">Últimos egresos</p>
        </CardHeader>
        <CardContent className="ml-0 space-y-2 font-sans">
          {expenses.length > 0 ? (
            expenses.map((e) => (
              <div
                key={e.id}
                className="flex justify-between text-sm text-stone-700"
              >
                <span>
                  {e.description || "Sin descripción"} -{" "}
                  {format(new Date(e.date), "dd/MM", { locale: es })}
                </span>
                <span className="font-semibold">€ {e.amount.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay egresos recientes
            </p>
          )}
          <Link href="/admin/accounting/expense">
            <Button
              className="font-sans mt-6 w-full border-neutral-900 bg-stone-200 hover:bg-stone-300 transition"
              variant="link"
            >
              Ver todos
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="bg-stone-50">
        <CardHeader>
          <p className="font-semibold">Ingresos por método de pago</p>
        </CardHeader>
        <CardContent className="ml-0 space-y-2 font-sans">
          {incomeByMethod.length > 0 ? (
            incomeByMethod.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-sm text-stone-700"
              >
                <span>{item.method}</span>
                <span className="font-semibold">€ {item.total.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay ingresos registrados
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-stone-50">
        <CardHeader>
          <p className="font-semibold">Promedio diario de ingresos</p>
        </CardHeader>
        <CardContent className="ml-0 space-y-2 font-sans text-stone-700">
          <p className="text-2xl lg:text-6xl font-semibold">
            € {avgIncome.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            Calculado en base a los últimos 30 días
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
