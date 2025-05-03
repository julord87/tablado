// src/app/admin/accounting/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  getAccountingTotals,
  getDailyIncomeVsExpenseLast30Days,
  getIncomeByTicketType,
  getIncomeTotalsByType,
  getMonthlyIncomeVsExpenseLast12Months,
} from "@/actions";
import {
  DailyBalanceChart,
  ExpensePieChart,
  IncomePieChart,
  MonthlyBalanceChart,
  TicketTypeIncomePieChart,
} from "@/components";
import { getExpenseTotalsByType } from "@/actions/expensesActions";

export default async function AccountingDashboardPage() {
  const hoy = new Date();
  const resumen = await getAccountingTotals(hoy);
  
  const last30Days = await getDailyIncomeVsExpenseLast30Days();
  const monthly = await getMonthlyIncomeVsExpenseLast12Months();

  const year = new Date().getFullYear();
  const incomeByType = await getIncomeTotalsByType(year);
  const expenseByType = await getExpenseTotalsByType(year);
  const ticketTypeIncome = await getIncomeByTicketType();

  return (
    <div className="space-y-6 m-8">
      <h1 className="text-4xl font-bold">Panel de Contabilidad</h1>

      <div className="flex flex-wrap gap-2 font-sans">
        <Link href="/admin/accounting/income">
          <Button
            className="flex gap-2 bg-stone-50 px-4 py-2 rounded hover:bg-stone-100"
            variant="outline"
          >
            💵 Admistrar Ingresos
          </Button>
        </Link>
        <Link href="/admin/accounting/expense">
          <Button
            className="flex gap-2 bg-stone-50 px-4 py-2 rounded hover:bg-stone-100"
            variant="outline"
          >
            💵 Administrar Gastos
          </Button>
        </Link>
      </div>

      {/* Tarjetas resumen con valores reales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/accounting/income">
          <Card>
            <CardContent className="bg-green-100 text-green-800 p-4 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm text-muted-foreground">Ingresos hoy</p>
              <p className="text-xl font-bold">
                € {resumen.ingresosHoy.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/accounting/expense">
          <Card>
            <CardContent className="bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm text-muted-foreground">Egresos hoy</p>
              <p className="text-xl font-bold">
                € {resumen.egresosHoy.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </Link>
        <Card>
          <CardContent className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">Balance mes</p>
            <p className="text-xl font-bold">
              € {resumen.balanceMes.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="bg-purple-100 text-purple-800 p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">Balance anual</p>
            <p className="text-xl font-bold">
              € {resumen.balanceAnual.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="bg-stone-50 lg:col-span-2">
          <CardHeader className="text-2xl">
            <CardTitle>Balance mensual (últimos 12 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyBalanceChart data={monthly} />
          </CardContent>
        </Card>


        <Card className="bg-stone-50">
          <CardHeader className="text-2xl mb-4">
            <CardTitle>Ingresos por tipo (histórico)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-64">
              <IncomePieChart data={incomeByType} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-stone-50">
          <CardHeader className="text-2xl mb-4">
            <CardTitle>Gastos por tipo (histórico)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-64">
              <ExpensePieChart data={expenseByType} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-stone-50">
          <CardHeader className="text-2xl mb-4">
            <CardTitle>Venta de tickets por tipo (histórico)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-64">
              <TicketTypeIncomePieChart data={ticketTypeIncome} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-stone-50 lg:col-span-3">
          <CardHeader className="text-2xl">
            <CardTitle>Balance diario (últimos 30 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyBalanceChart data={last30Days} />
          </CardContent>
        </Card>
      </div>

      {/* Últimos movimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-stone-50">
          <CardContent className="p-4">
            <p className="font-semibold mb-2">Últimos ingresos</p>
            {/* TODO: map últimos ingresos */}
            <p className="text-sm text-muted-foreground">
              [Ingresos recientes]
            </p>
            <Link href="/admin/accounting/income">
              <Button className="font-sans" variant="link">
                Ver todos
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-2">
            <p className="font-semibold mb-2">Últimos egresos</p>
            {/* TODO: map últimos egresos */}
            <p className="text-sm text-muted-foreground">[Egresos recientes]</p>
            <Link href="/admin/accounting/expense">
              <Button className="font-sans" variant="link">
                Ver todos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Cierre de caja */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground font-sans">
                Cierre de caja de hoy
              </p>
              <p className="text-lg font-bold">Pendiente</p>
            </div>
            <form action="/api/cash-close" method="POST">
              <Button className="font-sans" type="submit">
                💵 Cerrar caja del día
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
