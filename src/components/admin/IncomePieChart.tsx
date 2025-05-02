"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Props = {
  data: { type: string; amount: number }[];
};

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f472b6", "#34d399", "#a78bfa"];

export function IncomePieChart({ data }: Props) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="w-full h-96 font-sans">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="type"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `€ ${Number(value).toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center text-sm text-muted-foreground mt-2">
        Total del año: € {total.toFixed(2)}
      </div>
    </div>
  );
}
