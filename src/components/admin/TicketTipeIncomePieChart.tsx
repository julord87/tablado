"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#4ade80", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa"];

type Props = {
  data: {
    quantity: number;
    type: string;
    amount: number;
  }[];
};

export function TicketTypeIncomePieChart({ data }: Props) {
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
            outerRadius={110}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `€ ${Number(value).toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <Tooltip
        formatter={(value: any, name: any, props: any) => {
          const { payload } = props;
          return [
            `€ ${Number(payload.amount).toFixed(2)} — ${
              payload.quantity
            } tickets`,
            name,
          ];
        }}
      />
      <div className="text-center text-sm text-muted-foreground mt-2">
        Total histórico de tickets vendidos:{" "}
        {data.reduce((sum, d) => sum + d.quantity, 0)}
      </div>
    </div>
  );
}
