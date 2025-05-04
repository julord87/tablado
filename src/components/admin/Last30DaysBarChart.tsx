"use client";

import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
} from "recharts";

type Props = {
  data: { day: string; ingresos: number; egresos: number }[];
};

export function DailyBalanceChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: d.day.slice(5), // MM-DD
    Ingresos: d.ingresos,
    Egresos: d.egresos,
    Balance: d.ingresos - d.egresos,
  }));

  return (
    <div className="w-full h-96 font-sans">
      <ResponsiveContainer>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={4} />
          <YAxis />
          <Tooltip formatter={(value) => `€ ${Number(value).toFixed(2)}`} />
          <Legend />
          <Bar dataKey="Ingresos" fill="#4ade80" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Egresos" fill="#f87171" radius={[4, 4, 0, 0]} />
          <Line
            type="monotone"
            dataKey="Balance"
            stroke="#1d4ed8"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="text-center text-sm text-muted-foreground">
        Balance del mes: €{" "}
        {chartData.reduce((sum, d) => {
          return sum + d.Balance;
        }, 0).toFixed(2)}
      </div>
    </div>
  );
}
