// src/app/admin/accounting/page.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAccountingTotals, getMonthlyIncomeVsExpense } from "@/actions";
import { MonthlyBalanceChart } from "@/components";

export default async function AccountingDashboardPage() {
  const hoy = new Date();
  const resumen = await getAccountingTotals(hoy);

  const currentYear = new Date().getFullYear();
  const monthly = await getMonthlyIncomeVsExpense(currentYear);

  return (
    <div className="space-y-6 m-8">
      <h1 className="text-4xl font-bold">Panel de Contabilidad</h1>

      <div className="flex flex-wrap gap-2 font-sans">
        <Link href="/admin/accounting/income">
          <Button
            className="flex gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-500"
            variant="outline"
          >
            💵 Admistrar Ingresos
          </Button>
        </Link>
        <Link href="/admin/accounting/expense">
          <Button
            className="flex gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-500"
            variant="outline"
          >
            💵 Administrar Gastos
          </Button>
        </Link>
      </div>

      {/* Tarjetas resumen con valores reales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="bg-green-100 text-green-800 p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">Ingresos hoy</p>
            <p className="text-xl font-bold">
              € {resumen.ingresosHoy.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">Egresos hoy</p>
            <p className="text-xl font-bold">
              € {resumen.egresosHoy.toFixed(2)}
            </p>
          </CardContent>
        </Card>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="mb-3 font-semibold text-xl">Ingresos vs Egresos (mensual)</p>
            {/* Placeholder para gráfico de barras */}
            <div className="h-64  rounded-xl flex items-center justify-center text-muted-foreground my-16">
              <MonthlyBalanceChart data={monthly} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="mb-2 font-semibold">
              Distribución por tipo/categoría
            </p>
            {/* Placeholder para gráfico de torta */}
            <div className="h-64 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
              [Gráfico de torta]
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimos movimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 space-y-2">
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
